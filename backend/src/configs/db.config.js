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
    // Kiểm tra trạng thái kết nối thực tế trước khi reuse
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // Nếu đang connecting thì chờ
    if (mongoose.connection.readyState === 2) {
        console.log("⏳ Đang kết nối MongoDB, chờ...");
        return mongoose.connection;
    }

    // Reset nếu connection bị drop
    if (cached.conn && mongoose.connection.readyState !== 1) {
        console.log("⚠️ MongoDB connection bị mất, đang kết nối lại...");
        cached.conn = null;
        cached.promise = null;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // fail nhanh thay vì chờ 10s rồi mới báo lỗi
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000, // timeout chọn server sau 5s
            connectTimeoutMS: 10000, // timeout kết nối sau 10s
            socketTimeoutMS: 45000, // timeout socket sau 45s
            heartbeatFrequencyMS: 10000, // kiểm tra kết nối mỗi 10s
            retryWrites: true,
            w: 'majority',
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

// Lắng nghe sự kiện kết nối để xử lý khi mất kết nối
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
    cached.conn = null;
    cached.promise = null;
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
    cached.conn = null;
    cached.promise = null;
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
});
