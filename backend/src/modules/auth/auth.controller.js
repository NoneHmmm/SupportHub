import { ApiError } from "../../utils/apiError.js";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  sendSuccess(res, 200, "Đăng ký thành công", user);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { user, token, refreshToken } = await authService.loginUser(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  sendSuccess(res, 200, "Đăng nhập thành công", { user, token });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  await authService.logoutUser(refreshToken);
  res.clearCookie("refreshToken");
  sendSuccess(res, 200, "Đăng xuất thành công");
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const accessToken = await authService.refreshToken(refreshToken);
  sendSuccess(res, 200, "Token đã được cập nhật", accessToken);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const resetToken = await authService.forgotPassword(email);
  sendSuccess(res, 200, "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn", resetToken);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  sendSuccess(res, 200, "Mật khẩu đã được đặt lại thành công");
});
