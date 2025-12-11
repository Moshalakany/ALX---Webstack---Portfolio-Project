import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import MyAccount from "../myAccount/MyAccount";
import useListenMessages from "../../hooks/useListenMessages";

const Sidebar = () => {
	// Listen for new messages globally to update unread counts
	useListenMessages();

	return (
		<div className='border-r border-slate-500 p-4 flex flex-col'>
			<MyAccount />
			<div className='divider px-3'></div>
			<SearchInput />
			<div className='divider px-3'></div>
			<Conversations />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;

