import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    oldValue: {
        type: String,
        required: true,
    },
    newValue: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);