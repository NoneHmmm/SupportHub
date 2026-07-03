import { Router } from "express";
import * as ticketController from "./ticket.controller.js";
import {
  authMiddleware,
  requireRole,
} from "../../middlewares/auth.middleware.js";
import { uploadTicketImages } from "../../middlewares/upload.middleware.js";
import { ROLES } from "../../constants/index.js";

const router = Router();

// ────────────── Customer Routes ──────────────
router.post(
  "/",
  authMiddleware,
  uploadTicketImages,
  ticketController.createTicket,
);
router.get("/my", authMiddleware, ticketController.getMyTickets);
router.get("/:id", authMiddleware, ticketController.getTicketById);
router.patch("/:id/close", authMiddleware, ticketController.closeTicket);
router.post("/:id/reply", authMiddleware, ticketController.replyToTicket);
router.post("/:id/rating", authMiddleware, ticketController.rateTicket);

// ────────────── Admin / Leader Routes ──────────────
// GET "/" phải đặt sau GET "/:id" và GET "/my" để tránh route conflict
// Customer gọi GET /api/tickets sẽ nhận 403 (không có quyền)
// Admin/Leader gọi GET /api/tickets sẽ nhận danh sách
router.get(
  "/",
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.LEAD),
  ticketController.getAllTickets,
);
router.patch(
  "/:id/assign",
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.LEAD),
  ticketController.assignTicket,
);
router.patch(
  "/:id/priority",
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.LEAD),
  ticketController.updatePriority,
);
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.LEAD),
  ticketController.updateStatus,
);
router.patch(
  "/:id/transfer",
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.LEAD),
  ticketController.transferTicket,
);
router.patch(
  "/:id/reopen",
  authMiddleware,
  requireRole(ROLES.ADMIN, ROLES.LEAD),
  ticketController.reopenTicket,
);

export default router;
