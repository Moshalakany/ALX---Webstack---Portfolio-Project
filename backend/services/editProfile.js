import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

/**
 * Edit user profile service
 * Handles updating user profile information with validation
 */
export const editUserProfile = async (userId, updateData) => {
	try {
		// Find the user first
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		// Prepare update object
		const updateFields = {};

		// Validate and prepare fullName
		if (updateData.fullName !== undefined) {
			if (typeof updateData.fullName !== 'string' || updateData.fullName.trim().length === 0) {
				throw new Error("Full name must be a non-empty string");
			}
			updateFields.fullName = updateData.fullName.trim();
		}

		// Validate and prepare email
		if (updateData.email !== undefined) {
			if (updateData.email && typeof updateData.email === 'string') {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(updateData.email)) {
					throw new Error("Invalid email format");
				}
				// Check if email is already taken by another user
				const existingUser = await User.findOne({ 
					email: updateData.email, 
					_id: { $ne: userId } 
				});
				if (existingUser) {
					throw new Error("Email already exists");
				}
				updateFields.email = updateData.email;
			} else {
				updateFields.email = "";
			}
		}

		// Validate and prepare username
		if (updateData.username !== undefined) {
			if (typeof updateData.username !== 'string' || updateData.username.trim().length === 0) {
				throw new Error("Username must be a non-empty string");
			}
			// Check if username is already taken by another user
			const existingUser = await User.findOne({ 
				username: updateData.username.trim(), 
				_id: { $ne: userId } 
			});
			if (existingUser) {
				throw new Error("Username already exists");
			}
			updateFields.username = updateData.username.trim();
		}

		// Validate and prepare gender
		if (updateData.gender !== undefined) {
			if (!['male', 'female'].includes(updateData.gender)) {
				throw new Error("Gender must be either 'male' or 'female'");
			}
			updateFields.gender = updateData.gender;
		}

		// Handle profile picture
		if (updateData.profilepic !== undefined) {
			updateFields.profilepic = updateData.profilepic || "";
		}

		// Handle password update
		if (updateData.password !== undefined) {
			if (typeof updateData.password !== 'string' || updateData.password.length < 6) {
				throw new Error("Password must be at least 6 characters long");
			}
			// Hash the new password
			const salt = await bcrypt.genSalt(10);
			updateFields.password = await bcrypt.hash(updateData.password, salt);
		}

		// If no fields to update
		if (Object.keys(updateFields).length === 0) {
			throw new Error("No valid fields to update");
		}

		// Update the user
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			updateFields,
			{ new: true, runValidators: true }
		).select("-password");

		if (!updatedUser) {
			throw new Error("Failed to update user");
		}

		return updatedUser;
	} catch (error) {
		throw error;
	}
};

/**
 * Get user profile service
 * Retrieves user profile information
 */
export const getUserProfile = async (userId) => {
	try {
		const user = await User.findById(userId).select("-password");
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	} catch (error) {
		throw error;
	}
};

/**
 * Validate password service
 * Validates current password before allowing profile updates
 */
export const validateCurrentPassword = async (userId, currentPassword) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
		if (!isPasswordCorrect) {
			throw new Error("Current password is incorrect");
		}

		return true;
	} catch (error) {
		throw error;
	}
};