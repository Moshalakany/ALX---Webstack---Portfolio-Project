import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
	unreadCounts: {},
	setUnreadCounts: (unreadCounts) => set({ unreadCounts }),
	incrementUnread: (senderId) => set((state) => ({
		unreadCounts: {
			...state.unreadCounts,
			[senderId]: (state.unreadCounts[senderId] || 0) + 1,
		},
	})),
	clearUnread: (senderId) => set((state) => {
		const newCounts = { ...state.unreadCounts };
		delete newCounts[senderId];
		return { unreadCounts: newCounts };
	}),
}));

export default useConversation;
