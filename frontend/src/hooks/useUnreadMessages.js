import { useEffect, useCallback } from "react";
import useConversation from "../zustand/useConversation";
import { handleAuthError, isAuthError } from "../utils/handleAuthError";

const useUnreadMessages = () => {
	const { setUnreadCounts } = useConversation();

	const fetchUnreadCounts = useCallback(async () => {
		try {
			const res = await fetch("/api/messages/unread");
			
			if (isAuthError(res)) {
				handleAuthError();
				return;
			}
			
			const data = await res.json();
			if (data.error) {
				console.error("Error fetching unread counts:", data.error);
				return;
			}
			
			setUnreadCounts(data);
		} catch (error) {
			console.error("Error fetching unread counts:", error.message);
		}
	}, [setUnreadCounts]);

	const markAsRead = useCallback(async (senderId) => {
		try {
			const res = await fetch(`/api/messages/read/${senderId}`, {
				method: "PUT",
			});
			
			if (isAuthError(res)) {
				handleAuthError();
				return;
			}
			
			const data = await res.json();
			if (data.error) {
				console.error("Error marking messages as read:", data.error);
			}
		} catch (error) {
			console.error("Error marking messages as read:", error.message);
		}
	}, []);

	useEffect(() => {
		fetchUnreadCounts();
	}, [fetchUnreadCounts]);

	return { fetchUnreadCounts, markAsRead };
};

export default useUnreadMessages;
