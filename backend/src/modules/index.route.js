import { Router } from "express";
import authRoutes from "./auth/auth.route.js";
import userRoutes from "./user/user.route.js";
import ticketRoutes from "./ticket/ticket.route.js";
import dashboardRoutes from "./dashboard/dashboard.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/ticket", ticketRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
