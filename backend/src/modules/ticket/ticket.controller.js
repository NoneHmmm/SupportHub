import { asyncHandler } from "../../utils/asyncHandler.js";
import * as ticketService from "./ticket.service.js";
import { sendSuccess, sendPaginated } from "../../utils/apiResponse.js";

export const createTicket = asyncHandler(async (req, res) => {
  console.log("== createTicket controller ==");
  const result = await ticketService.createTicket(
    req.user,
    req.body,
    req.uploadedImages || [],
  );
  sendSuccess(res, 201, "Tạo ticket thành công", result);
});

export const getMyTickets = asyncHandler(async (req, res) => {
  const result = await ticketService.getMyTickets(req.user, req.query);
  sendPaginated(
    res,
    result.items,
    result.pagination,
    "Lấy danh sách ticket thành công",
  );
});

export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await ticketService.getTicketById(req.params.id, req.user);
  sendSuccess(res, 200, "Lấy thông tin ticket thành công", ticket);
});

export const closeTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.closeTicket(req.params.id, req.user);
  sendSuccess(res, 200, "Đóng ticket thành công", ticket);
});

export const replyToTicket = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const reply = await ticketService.replyToTicket(
    req.params.id,
    req.user,
    message,
  );
  sendSuccess(res, 201, "Gửi phản hồi thành công", reply);
});

export const rateTicket = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const ticket = await ticketService.rateTicket(
    req.params.id,
    req.user,
    rating,
  );
  sendSuccess(res, 200, "Đánh giá ticket thành công", ticket);
});
