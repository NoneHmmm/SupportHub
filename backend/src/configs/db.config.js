import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("Vui lòng khai báo MONGO_URI trong biến môi trường");
}

// Cache connection qua các lần gọi function (bắt buộc cho serverless/Vercel)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) {
        console.log("♻️ Dùng lại MongoDB connection đã có");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // fail nhanh thay vì chờ 10s rồi mới báo lỗi
            maxPoolSize: 10,
        };

        console.log("Connecting MongoDB...");

        cached.promise = mongoose
            .connect(MONGO_URI, opts)
            .then((mongooseInstance) => {
                console.log("✅ Mongo Connected");
                console.log(`Database: ${mongooseInstance.connection.name}`);
                console.log(`Host: ${mongooseInstance.connection.host}`);
                return mongooseInstance;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null; // reset để lần sau thử connect lại
        console.error("❌ Mongo Error:", err);
        throw err;
    }

    return cached.conn;
};