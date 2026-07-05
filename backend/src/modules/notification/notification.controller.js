import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess, sendPaginated } from "../../utils/apiResponse.js";
import * as notificationService from "./notification.service.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, unreadOnly } = req.query;
  const result = await notificationService.getNotifications({
    userId: req.user._id,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    unreadOnly: unreadOnly === "true",
  });
  sendPaginated(res, result.notifications, result.pagination, "Lấy danh sách thông báo thành công");
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await notificationService.markAsRead(id, req.user._id);
  sendSuccess(res, 200, "Đánh dấu đã đọc thành công", notification);
});
