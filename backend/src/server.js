import 'dotenv/config';
import app from './app.js';
import { connectDB } from './configs/db.config.js';

const PORT = process.env.PORT || 5001;

const start = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`SupportHub API đang chạy trên cổng ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
};

start().catch((err) => {
    console.error('Lỗi khi khởi động server:', err);
    process.exit(1);
});
