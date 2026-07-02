import { User } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";
import bcrypt from "bcryptjs";

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Người dùng không tồn tại");
  }
  return user;
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Người dùng không tồn tại");
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Mật khẩu cũ không chính xác");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.updateOne({ _id: userId }, { password: hashedPassword });
  return user;
};

export const updateProfile = async (userId, updateData) => {

  if (updateData.email) {
    const existingUser = await User.findOne({
      email: updateData.email,
    });

    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ApiError(400, "Email đã tồn tại");
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  );
  if (!user) {
    throw new ApiError(404, "Người dùng không tồn tại");
  }
  return user;
};
