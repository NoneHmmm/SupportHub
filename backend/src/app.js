import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import routes from "./modules/index.route.js";
import morgan from "morgan";
import { authLimiter } from "./middlewares/rateLimiter.middleware.js";
import { notFound } from "./middlewares/errorHandler.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();
app.set("trust proxy", 1);

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(helmet());
app.use(morgan("dev"));
app.use("/api", authLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;