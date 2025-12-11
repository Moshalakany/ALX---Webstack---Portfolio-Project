import useGetConversations from "../../hooks/useGetConversations";
import useUnreadMessages from "../../hooks/useUnreadMessages";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	const { markAsRead } = useUnreadMessages();

	const handleConversationSelect = (senderId) => {
		markAsRead(senderId);
	};

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					lastIdx={idx === conversations.length - 1}
					onSelect={handleConversationSelect}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};
export default Conversations;

