import { ApiError } from "../utils/apiError.js";

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Không tìm thấy route: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi máy chủ nội bộ';
  const errors = err.errors || [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field} đã tồn tại`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Định dạng ID không hợp lệ';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token hết hạn';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
