import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendPaginated } from "../../utils/apiResponse.js";
import * as activityLogService from "./activityLog.service.js";

export const getLogs = asyncHandler(async (req, res) => {
  const { page, limit, ticketId, userId, action, sort } = req.query;
  const result = await activityLogService.getLogs({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    ticketId,
    userId,
    action,
    sort,
  });
  sendPaginated(res, result.logs, result.pagination, "Lấy lịch sử hoạt động thành công");
});
