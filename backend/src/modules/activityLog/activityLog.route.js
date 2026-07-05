import { Router } from "express";
import * as activityLogController from "./activityLog.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, activityLogController.getLogs);

export default router;
