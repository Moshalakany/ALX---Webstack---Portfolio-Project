import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { handleAuthError, isAuthError } from "../utils/handleAuthError";

const useEditProfile = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const editProfile = async (updateData) => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updateData),
			});

			if (isAuthError(res)) {
				handleAuthError();
				return;
			}

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			// Update local storage and auth context with new user data
			localStorage.setItem("chat-user", JSON.stringify(data.user));
			setAuthUser(data.user);
			toast.success("Profile updated successfully!");
			return data.user;
		} catch (error) {
			toast.error(error.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
		// Validate inputs
		if (!currentPassword || !newPassword || !confirmPassword) {
			toast.error("Please fill in all password fields");
			return false;
		}

		if (newPassword !== confirmPassword) {
			toast.error("New passwords don't match");
			return false;
		}

		if (newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return false;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/users/change-password", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
			});

			if (isAuthError(res)) {
				handleAuthError();
				return false;
			}

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			toast.success("Password changed successfully!");
			return true;
		} catch (error) {
			toast.error(error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { loading, editProfile, changePassword };
};

export default useEditProfile;
