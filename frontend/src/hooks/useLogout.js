import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { isAuthError } from "../utils/handleAuthError";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			
			if (isAuthError(res)) {
				// If already unauthorized, just clear locally
				localStorage.removeItem("chat-user");
				localStorage.clear();
				document.cookie.split(";").forEach((cookie) => {
					const name = cookie.split("=")[0].trim();
					document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
				});
				setAuthUser(null);
				return;
			}
			
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.removeItem("chat-user");
			localStorage.clear();
			document.cookie.split(";").forEach((cookie) => {
				const name = cookie.split("=")[0].trim();
				document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
			});
			setAuthUser(null);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;
