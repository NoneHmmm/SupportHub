import mongoose from 'mongoose';
import { TICKET_STATUS, TICKET_TYPE, TICKET_PRIORITY } from '../constants/index.js';

const ticketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(TICKET_TYPE),
        default: null
    },
    priority: {
        type: String,
        enum: Object.values(TICKET_PRIORITY),
        default: null
    },
    status: {
        type: String,
        enum: Object.values(TICKET_STATUS),
        default: TICKET_STATUS.PENDING,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dueDate: {
        type: Date,
    },
    closedAt: {
        type: Date,
    },
    tags: {
        type: [String],
    },
    resolvedAt: {
        type: Date,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
    },
}, { timestamps: true });

//index để truy vấn nhanh hơn
ticketSchema.index({ ticketNumber: 1, createdAt: -1 });
ticketSchema.index({ senderId: 1, createdAt: -1 });
ticketSchema.index({ recipientId: 1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, createdAt: -1 });
ticketSchema.index({ status: 1, createdAt: -1 });
ticketSchema.index({ type: 1, createdAt: -1 });
ticketSchema.index({ priority: 1, createdAt: -1 });
ticketSchema.index({ tags: 1, createdAt: -1 });
ticketSchema.index({ resolvedAt: 1, createdAt: -1 });
ticketSchema.index({ closedAt: 1, createdAt: -1 });
ticketSchema.index({ dueDate: 1, createdAt: -1 });
ticketSchema.index({ rating: 1, createdAt: -1 });

export const Ticket = mongoose.model("Ticket", ticketSchema);