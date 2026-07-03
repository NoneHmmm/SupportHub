import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("Connecting MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Mongo Connected");
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}`);
    } catch (err) {
        console.error("❌ Mongo Error:", err);
        throw err;
    }
};