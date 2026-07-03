import { Ticket, TicketMessage, Attachment, ActivityLog, User } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";
import { validateInput } from "../../utils/missingInput.js";
import { TICKET_STATUS, TICKET_PRIORITY } from "../../constants/index.js";
import mongoose from "mongoose";

const buildTicketNumber = async () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const ymd =
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
  const count = await Ticket.countDocuments();
  return `TICKET-${ymd}-${String(count + 1).padStart(5, "0")}`;
};

const ensureValidId = (id, label = "id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Định dạng ${label} không hợp lệ`);
  }
};

const findCustomerTicket = async (ticketId, userId) => {
  ensureValidId(ticketId, "ticket id");
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new ApiError(404, "Ticket không tồn tại");
  }
  if (ticket.senderId?.toString() !== userId.toString()) {
    throw new ApiError(403, "Bạn không có quyền truy cập ticket này");
  }
  return ticket;
};

export const createTicket = async (userId, ticketData, uploadedImages = []) => {
  const { title, description, type } = ticketData;

  validateInput({ title, description }, ["title", "description"]);

  const ticketNumber = await buildTicketNumber();
  const ticket = new Ticket({
    ticketNumber,
    title,
    description,
    type,
    senderId: userId,
    status: TICKET_STATUS.PENDING,
  });
  await ticket.save();

  let attachments = [];
  if (uploadedImages.length > 0) {
    const attachmentDocs = uploadedImages.map((image) => ({
      ...image,
      ticketId: ticket._id,
      uploadedBy: userId,
    }));
    attachments = await Attachment.insertMany(attachmentDocs);
  }

  return { ticket, attachments };
};

export const getMyTickets = async (userId, query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = { senderId: userId };
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;
  if (query.priority) filter.priority = query.priority;

  const [items, total] = await Promise.all([
    Ticket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Ticket.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getTicketById = async (ticketId, userId) => {
  const ticket = await findCustomerTicket(ticketId, userId);
  const attachments = await Attachment.find({ ticketId: ticket._id });
  return { ticket, attachments };
};

export const closeTicket = async (ticketId, userId) => {
  const ticket = await findCustomerTicket(ticketId, userId);

  if (ticket.status === TICKET_STATUS.CLOSED) {
    throw new ApiError(400, "Ticket đã được đóng trước đó");
  }

  ticket.status = TICKET_STATUS.CLOSED;
  ticket.closedAt = new Date();
  await ticket.save();
  return ticket;
};

export const replyToTicket = async (ticketId, userId, message) => {
  validateInput({ message }, ["message"]);

  const ticket = await findCustomerTicket(ticketId, userId);

  if (ticket.status === TICKET_STATUS.CLOSED) {
    throw new ApiError(400, "Ticket đã đóng, không thể gửi phản hồi");
  }

  const ticketMessage = new TicketMessage({
    ticketId: ticket._id,
    senderId: userId,
    recipientId: ticket.assignedTo || ticket.recipientId,
    message,
  });
  await ticketMessage.save();
  return ticketMessage;
};

export const rateTicket = async (ticketId, userId, rating) => {
  ensureValidId(ticketId, "ticket id");

  const numericRating = Number(rating);
  if (
    !Number.isFinite(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    throw new ApiError(400, "Đánh giá phải là số từ 1 đến 5");
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new ApiError(404, "Ticket không tồn tại");
  }
  if (ticket.senderId?.toString() !== userId.toString()) {
    throw new ApiError(403, "Bạn không có quyền đánh giá ticket này");
  }

  if (
    ticket.status !== TICKET_STATUS.RESOLVED &&
    ticket.status !== TICKET_STATUS.CLOSED
  ) {
    throw new ApiError(
      400,
      "Chỉ có thể đánh giá ticket đã được giải quyết hoặc đã đóng",
    );
  }

  ticket.rating = numericRating;
  await ticket.save();
  return ticket;
};

// ────────────── Admin / Leader APIs ──────────────

/** Helper: tìm ticket không check quyền sở hữu */
const findTicket = async (ticketId) => {
  ensureValidId(ticketId, "ticket id");
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new ApiError(404, "Ticket không tồn tại");
  }
  return ticket;
};

/** Helper: ghi activity log */
const logActivity = async (ticketId, userId, action, oldValue, newValue) => {
  const activity = new ActivityLog({ ticketId, userId, action, oldValue, newValue });
  await activity.save();
};

/** 1. GET /api/tickets — danh sách tất cả tickets (có filter, search, phân trang) */
export const getAllTickets = async (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;
  if (query.priority) filter.priority = query.priority;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  if (query.search) {
    filter.$or = [
      { ticketNumber: { $regex: query.search, $options: "i" } },
      { title: { $regex: query.search, $options: "i" } },
    ];
  }

  const sortField = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    Ticket.find(filter)
      .populate("senderId", "fullName email")
      .populate("assignedTo", "fullName email")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
};

/** 2. PATCH /api/tickets/:id/assign — phân công ticket cho agent */
export const assignTicket = async (ticketId, userId, assignedTo) => {
  validateInput({ assignedTo }, ["assignedTo"]);

  if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
    throw new ApiError(400, "Định dạng ID người dùng không hợp lệ");
  }

  const assignee = await User.findById(assignedTo);
  if (!assignee) {
    throw new ApiError(404, "Người dùng được chỉ định không tồn tại");
  }

  const ticket = await findTicket(ticketId);
  const oldAssignee = ticket.assignedTo ? ticket.assignedTo.toString() : "unassigned";

  ticket.assignedTo = assignedTo;
  if (ticket.status === TICKET_STATUS.PENDING) {
    ticket.status = TICKET_STATUS.IN_PROGRESS;
  }
  await ticket.save();

  await logActivity(ticketId, userId, "assign", oldAssignee, assignedTo);

  return ticket;
};

/** 3. PATCH /api/tickets/:id/priority — cập nhật mức độ ưu tiên */
export const updatePriority = async (ticketId, userId, priority) => {
  if (!Object.values(TICKET_PRIORITY).includes(priority)) {
    throw new ApiError(
      400,
      `Priority không hợp lệ. Chấp nhận: ${Object.values(TICKET_PRIORITY).join(", ")}`,
    );
  }

  const ticket = await findTicket(ticketId);
  const oldPriority = ticket.priority || "none";

  ticket.priority = priority;
  await ticket.save();

  await logActivity(ticketId, userId, "priority", oldPriority, priority);

  return ticket;
};

/** 4. PATCH /api/tickets/:id/status — cập nhật trạng thái */
export const updateStatus = async (ticketId, userId, status) => {
  if (!Object.values(TICKET_STATUS).includes(status)) {
    throw new ApiError(
      400,
      `Status không hợp lệ. Chấp nhận: ${Object.values(TICKET_STATUS).join(", ")}`,
    );
  }

  const ticket = await findTicket(ticketId);
  const oldStatus = ticket.status;

  ticket.status = status;
  if (status === TICKET_STATUS.RESOLVED) {
    ticket.resolvedAt = new Date();
  }
  if (status === TICKET_STATUS.CLOSED) {
    ticket.closedAt = new Date();
  }
  await ticket.save();

  await logActivity(ticketId, userId, "status", oldStatus, status);

  return ticket;
};

/** 5. PATCH /api/tickets/:id/transfer — chuyển ticket cho agent khác */
export const transferTicket = async (ticketId, userId, assignedTo) => {
  validateInput({ assignedTo }, ["assignedTo"]);

  if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
    throw new ApiError(400, "Định dạng ID người dùng không hợp lệ");
  }

  const assignee = await User.findById(assignedTo);
  if (!assignee) {
    throw new ApiError(404, "Người dùng được chuyển đến không tồn tại");
  }

  const ticket = await findTicket(ticketId);
  const oldAssignee = ticket.assignedTo ? ticket.assignedTo.toString() : "unassigned";

  ticket.assignedTo = assignedTo;
  if (ticket.status === TICKET_STATUS.PENDING) {
    ticket.status = TICKET_STATUS.IN_PROGRESS;
  }
  await ticket.save();

  await logActivity(ticketId, userId, "transfer", oldAssignee, assignedTo);

  return ticket;
};

/** 6. PATCH /api/tickets/:id/reopen — mở lại ticket đã đóng */
export const reopenTicket = async (ticketId, userId) => {
  const ticket = await findTicket(ticketId);

  if (ticket.status !== TICKET_STATUS.CLOSED && ticket.status !== TICKET_STATUS.RESOLVED) {
    throw new ApiError(400, "Chỉ có thể mở lại ticket đã đóng hoặc đã giải quyết");
  }

  const oldStatus = ticket.status;
  ticket.status = TICKET_STATUS.IN_PROGRESS;
  ticket.closedAt = null;
  ticket.resolvedAt = null;
  await ticket.save();

  await logActivity(ticketId, userId, "reopen", oldStatus, TICKET_STATUS.IN_PROGRESS);

  return ticket;
};
