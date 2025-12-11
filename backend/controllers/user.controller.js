import User from "../models/user.model.js";
import { editUserProfile, getUserProfile, validateCurrentPassword } from "../services/editProfile.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get user profile controller
 */
export const getProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const userProfile = await getUserProfile(userId);
		
		res.status(200).json(userProfile);
	} catch (error) {
		console.error("Error in getProfile: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Edit user profile controller
 */
export const editProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const updateData = req.body;

		// If password is being updated, validate current password
		if (updateData.password && updateData.currentPassword) {
			await validateCurrentPassword(userId, updateData.currentPassword);
			// Remove currentPassword from updateData as it's not needed for update
			delete updateData.currentPassword;
		} else if (updateData.password && !updateData.currentPassword) {
			return res.status(400).json({ error: "Current password is required to change password" });
		}

		const updatedUser = await editUserProfile(userId, updateData);
		
		res.status(200).json({
			message: "Profile updated successfully",
			user: updatedUser
		});
	} catch (error) {
		console.error("Error in editProfile: ", error.message);
		
		// Handle specific error types
		if (error.message.includes("already exists") || 
		    error.message.includes("Invalid") || 
		    error.message.includes("must be") ||
		    error.message.includes("required") ||
		    error.message.includes("incorrect")) {
			return res.status(400).json({ error: error.message });
		}
		
		if (error.message === "User not found") {
			return res.status(404).json({ error: error.message });
		}
		
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Change password controller
 */
export const changePassword = async (req, res) => {
	try {
		const userId = req.user._id;
		const { currentPassword, newPassword, confirmPassword } = req.body;

		// Validate required fields
		if (!currentPassword || !newPassword || !confirmPassword) {
			return res.status(400).json({ error: "All password fields are required" });
		}

		// Check if new passwords match
		if (newPassword !== confirmPassword) {
			return res.status(400).json({ error: "New passwords don't match" });
		}

		// Validate current password
		await validateCurrentPassword(userId, currentPassword);

		// Update password
		await editUserProfile(userId, { password: newPassword });
		
		res.status(200).json({ message: "Password changed successfully" });
	} catch (error) {
		console.error("Error in changePassword: ", error.message);
		
		if (error.message.includes("incorrect") || 
		    error.message.includes("must be") ||
		    error.message.includes("required")) {
			return res.status(400).json({ error: error.message });
		}
		
		if (error.message === "User not found") {
			return res.status(404).json({ error: error.message });
		}
		
		res.status(500).json({ error: "Internal server error" });
	}
};
