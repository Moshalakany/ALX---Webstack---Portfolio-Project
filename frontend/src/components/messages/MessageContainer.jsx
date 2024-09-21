import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import { extractTime } from "../../utils/extractTime";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";


const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);	
	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className="collapse collapse-arrow bg-base-200">
 						 <input type="radio" name="my-accordion-2" defaultChecked />
 						 <div className="collapse-title text-xl font-medium">To: {selectedConversation.fullName  }</div>
 				 		<div className="collapse-content">
 			   			<p> last online:{extractTime(selectedConversation.lastOnline)+" on "+selectedConversation.lastOnline }</p>
				  		</div>	
					</div>				
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};

