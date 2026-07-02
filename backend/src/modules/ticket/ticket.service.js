import { Ticket, TicketMessage, Attachment } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";
import { validateInput } from "../../utils/missingInput.js";
import { TICKET_STATUS } from "../../constants/index.js";
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
