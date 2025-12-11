import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const getStoredUser = () => {
		try {
			const storedUser = localStorage.getItem("chat-user");
			return storedUser ? JSON.parse(storedUser) : null;
		} catch (error) {
			// If there's an error parsing the stored user data, clear it
			localStorage.removeItem("chat-user");
			return null;
		}
	};

	const [authUser, setAuthUser] = useState(getStoredUser());

	return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};
