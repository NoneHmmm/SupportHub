import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        required: true,
    },
    resetTokenExpiresAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

passwordResetTokenSchema.index({ resetTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken = mongoose.model("PasswordResetToken", passwordResetTokenSchema);