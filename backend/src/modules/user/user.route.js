import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as userController from "./user.controller.js";

const router = Router();

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/change-password", authMiddleware, userController.changePassword);
router.patch("/update-profile", authMiddleware, userController.updateProfile);

export default router;