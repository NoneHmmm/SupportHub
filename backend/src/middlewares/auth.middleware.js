import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
    if (!token) throw new ApiError(401, 'Authentication required');
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
});