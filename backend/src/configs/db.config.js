import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("Connecting MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Mongo Connected");
        console.log("ReadyState:", mongoose.connection.readyState);
        console.log("DB:", mongoose.connection.name);
    } catch (err) {
        console.error("❌ Mongo Error:", err);
        throw err;
    }
};