import { User, Session, PasswordResetToken } from "../../models/index.js";
import { ApiError } from "../../utils/apiError.js";
import bcrypt from "bcryptjs";
import { validateInput } from "../../utils/missingInput.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendForgotPasswordEmail,
  sendResetPasswordSuccessEmail,
} from "../../utils/nodemailer.js";

export const registerUser = async (userData) => {
  const { fullName, email, password } = userData;

  validateInput({ fullName, email, password }, [
    "fullName",
    "email",
    "password",
  ]);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Người dùng với email này đã tồn tại");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Mật khẩu phải có ít nhất 8 ký tự");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({ ...userData, password: hashedPassword });

  await user.save();

  return user;
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  validateInput({ email, password }, ["email", "password"]);

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Email hoặc mật khẩu không chính xác");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Email hoặc mật khẩu không chính xác");
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TTL },
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");
  const session = new Session({
    userId: user._id,
    refreshToken: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await Session.deleteMany({ userId: user._id });
  await session.save();

  return { user, token: accessToken, refreshToken };
};

export const logoutUser = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw new ApiError(401, "Token không hợp lệ");
  }
  await session.deleteOne();
  return true;
};

export const refreshToken = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw new ApiError(401, "Token không hợp lệ");
  }
  if (session.expiresAt < Date.now()) {
    throw new ApiError(401, "Token đã hết hạn");
  }
  const accessToken = jwt.sign(
    { userId: session.userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_TTL,
    },
  );
  return accessToken;
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "Người dùng không tồn tại");
  }

  const resetToken = crypto.randomBytes(64).toString("hex");
  const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const passwordResetToken = new PasswordResetToken({
    userId: user._id,
    email: email,
    resetToken: resetToken,
    resetTokenExpiresAt: resetTokenExpiresAt,
  });
  await passwordResetToken.save();

  await sendForgotPasswordEmail(email, resetToken);

  return resetLink;
};

export const resetPassword = async (resetToken, newPassword) => {
  const passwordResetToken = await PasswordResetToken.findOne({ resetToken });
  if (!passwordResetToken) {
    throw new ApiError(404, "Token không hợp lệ");
  }
  const user = await User.findOne({ _id: passwordResetToken.userId });
  if (!user) {
    throw new ApiError(404, "Người dùng không tồn tại");
  }
  if (passwordResetToken.resetTokenExpiresAt < Date.now()) {
    throw new ApiError(401, "Token đã hết hạn");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });
  await PasswordResetToken.deleteOne({ resetToken });
  await sendResetPasswordSuccessEmail(user.email);
  return true;
};
