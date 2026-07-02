import { asyncHandler } from "../../utils/asyncHandler.js";
import * as userService from "./user.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  sendSuccess(res, 200, "Lấy thông tin người dùng thành công", user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userService.changePassword(req.user.id, oldPassword, newPassword);
  sendSuccess(res, 200, "Đổi mật khẩu thành công", user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, avatar } = req.body;
  const updateData = { fullName, email, avatar };
  const user = await userService.updateProfile(req.user.id, updateData);
  sendSuccess(res, 200, "Cập nhật thông tin người dùng thành công", user);
});