import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, getProfile, editProfile, changePassword } from "../controllers/user.controller.js";

const router = express.Router();

// Get users for sidebar
router.get("/", protectRoute, getUsersForSidebar);

// Profile management routes
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, editProfile);
router.put("/change-password", protectRoute, changePassword);

export default router;
