import transporter from "../configs/mailer.config.js";
import { SEND_FORGOT_PASSWORD_TEMPLATE, SEND_RESET_PASSWORD_SUCCESS_TEMPLATE } from "../templates/index.js";

export const sendForgotPasswordEmail = async (to, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Reset Password",
    html: SEND_FORGOT_PASSWORD_TEMPLATE(resetLink),
  };
  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordSuccessEmail = async (to) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Reset Password",
    html: SEND_RESET_PASSWORD_SUCCESS_TEMPLATE(),
  };
  await transporter.sendMail(mailOptions);
};