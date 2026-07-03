import { Router } from "express";
import * as dashboardController from "./dashboard.controller.js";
import {
    authMiddleware,
    requireRole,
} from "../../middlewares/auth.middleware.js";
import { ROLES } from "../../constants/index.js";

const router = Router();

// GET /api/dashboard — any authenticated user
router.get("/", authMiddleware, dashboardController.getGeneralDashboard);

// GET /api/dashboard/admin — admin only
router.get(
    "/admin",
    authMiddleware,
    requireRole(ROLES.ADMIN),
    dashboardController.getAdminDashboard,
);

// GET /api/dashboard/agent — agent (and admin/leader) only
router.get(
    "/agent",
    authMiddleware,
    requireRole(ROLES.ADMIN, ROLES.LEAD, ROLES.AGENT),
    dashboardController.getAgentDashboard,
);

// GET /api/dashboard/customer — customer (and anyone) only
router.get(
    "/customer",
    authMiddleware,
    dashboardController.getCustomerDashboard,
);

export default router;
