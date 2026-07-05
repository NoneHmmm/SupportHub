import 'dotenv/config';
import app from './app.js';
import { connectDB } from './configs/db.config.js';

import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5001;

const start = async () => {
    await connectDB();

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`SupportHub API đang chạy trên cổng ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
};

start().catch((err) => {
    console.error('Lỗi khi khởi động server:', err);
    process.exit(1);
});
