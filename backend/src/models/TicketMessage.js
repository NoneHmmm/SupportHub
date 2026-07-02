import mongoose from 'mongoose';

const ticketMessageSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    isInternal: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

ticketMessageSchema.index({ ticketId: 1, createdAt: -1 });

export const TicketMessage = mongoose.model('TicketMessage', ticketMessageSchema);