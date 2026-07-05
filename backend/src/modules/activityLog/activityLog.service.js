import { ActivityLog } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";

export const getLogs = async ({ page = 1, limit = 20, ticketId, userId, action, sort = "-createdAt" }) => {
  const filter = {};

  if (ticketId) filter.ticketId = ticketId;
  if (userId) filter.userId = userId;
  if (action) filter.action = action;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate("userId", "fullName email avatar")
      .populate("ticketId", "title code")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
