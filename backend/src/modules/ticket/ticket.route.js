import { Router } from "express";
import * as ticketController from "./ticket.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { uploadTicketImages } from "../../middlewares/upload.middleware.js";

const router = Router();

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

export default router;
