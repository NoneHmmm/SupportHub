import mongoose from "mongoose";
import { ROLES } from "../constants/index.js";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.CUSTOMER,
    },
    avatar: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
