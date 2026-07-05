import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../constants/index.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Bạn cần đăng nhập để thực hiện hành động này");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(401, "Tài khoản không tồn tại");
    }
    if (!user.isActive) {
      throw new ApiError(403, "Tài khoản đã bị khóa");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Phiên đăng nhập đã hết hạn");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Token không hợp lệ");
    }
    throw error;
  }
});

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Bạn cần đăng nhập"));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Bạn không có quyền thực hiện hành động này"),
      );
    }
    next();
  };
};
