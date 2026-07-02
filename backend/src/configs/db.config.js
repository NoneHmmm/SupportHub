import mongoose from "mongoose";

// Prevent Mongoose from buffering queries when not connected
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
    try {
        console.log("Connecting MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 15000,
        });
        console.log("✅ Mongo Connected");
    } catch (err) {
        console.error("❌ Mongo Error:", err);
        throw err;
    }
};
