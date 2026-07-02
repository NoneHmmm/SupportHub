import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Kết nối MongoDB thành công:", mongoose.connection.host);
    } catch (error) {
        console.error("Lỗi khi kết nối đến MongoDB:", error);
        process.exit(1);
    }
};