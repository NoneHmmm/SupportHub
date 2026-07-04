import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully");
        console.log("MongoDB URI:", process.env.MONGO_URI);
        console.log("MongoDB connection options:", mongoose.connection.name);
        console.log("MongoDB connection options:", mongoose.connection.host);
        console.log("MongoDB connection options:", mongoose.connection.port);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

