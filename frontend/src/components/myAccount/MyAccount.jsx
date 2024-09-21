import { useAuthContext } from "../../context/AuthContext";

export default function MyAccount() {
return (
        <div>
            <GetUserInfo/>
        </div>
);
}

const GetUserInfo=()=>
    {
        const { authUser } = useAuthContext();
        return (
				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
						<p className='font-bold text-red-400 '> Your Profile Info</p>
					</div>
            <div className="card bg-base-100 w-96 shadow-xl flex flex-col items-center justify-center min-w-96 mx-auto">
                	<div className="avatar online">
					<div className='w-12 rounded-full'>
						<img src={authUser.profilepic} alt='user avatar' />
					</div>
				</div>
					<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
					<p className='font-bold text-gray-200'>Full Name : {authUser.fullName}</p>
					</div>
					</div>
					<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
					<p className='font-bold text-gray-200'>Username : {authUser.username}</p>
					</div>
					</div>
				</div>
				<div>
					<p>
						
					</p>
				</div>
			</div>
        );

    }