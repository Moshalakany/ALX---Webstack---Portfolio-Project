import express from "express";
import { getMessages, sendMessage, getUnreadCounts, markMessagesAsRead } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/unread", protectRoute, getUnreadCounts);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/read/:id", protectRoute, markMessagesAsRead);

export default router;
