import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji, onSelect }) => {
	const { selectedConversation, setSelectedConversation, unreadCounts, clearUnread } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);
	const unreadCount = unreadCounts[conversation._id] || 0;

	const handleClick = () => {
		setSelectedConversation(conversation);
		// Clear unread count and mark messages as read
		if (unreadCount > 0) {
			clearUnread(conversation._id);
			if (onSelect) onSelect(conversation._id);
		}
	};

	return (
		<>
			<div
				className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-500" : ""}
			`}
				onClick={handleClick}
			>
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className='w-12 rounded-full'>
						<img src={conversation.profilepic} alt='user avatar' />
					</div>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
						<p className='font-bold text-gray-200'>{conversation.fullName}</p>
						<div className='flex items-center gap-2'>
							{unreadCount > 0 && (
								<span className='bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1'>
									{unreadCount > 99 ? "99+" : unreadCount}
								</span>
							)}
							<span className='text-xl'>{emoji}</span>
						</div>
					</div>
				</div>
			</div>

			{!lastIdx && <div className='divider my-0 py-0 h-1' />}
		</>
	);
};
export default Conversation;

