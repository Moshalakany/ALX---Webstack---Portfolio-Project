import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();

	useEffect(() => {
		const handleNewMessage = (newMessage) => {
			// Get the latest state from the store to avoid stale closures
			const { selectedConversation, messages, setMessages, incrementUnread } = useConversation.getState();

			// Play notification sound
			const sound = new Audio(notificationSound);
			sound.play().catch(() => {});

			const senderId = newMessage.senderId;

			// Check if this message is from the currently selected conversation
			if (selectedConversation && senderId === selectedConversation._id) {
				newMessage.shouldShake = true;
				setMessages([...messages, newMessage]);
			} else {
				// Message is from a different conversation, increment unread count
				incrementUnread(senderId);
			}
		};

		socket?.on("newMessage", handleNewMessage);

		return () => socket?.off("newMessage", handleNewMessage);
	}, [socket]);
};
export default useListenMessages;
