import { Notification } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";

export const getNotifications = async ({ userId, page = 1, limit = 20, unreadOnly = false }) => {
  const filter = { userId };

  if (unreadOnly) filter.isRead = false;

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate("ticketId", "title code")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter),
    Notification.countDocuments({ userId, isRead: false }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });

  if (!notification) {
    throw new ApiError(404, "Thông báo không tồn tại");
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};
