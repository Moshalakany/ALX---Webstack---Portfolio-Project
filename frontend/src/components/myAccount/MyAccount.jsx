import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useEditProfile from "../../hooks/useEditProfile";

export default function MyAccount() {
	const [isEditing, setIsEditing] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);

	return (
		<div>
			{isEditing ? (
				<EditProfileForm onClose={() => setIsEditing(false)} />
			) : (
				<GetUserInfo onEdit={() => setIsEditing(true)} onChangePassword={() => setShowPasswordModal(true)} />
			)}
			{showPasswordModal && (
				<ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
			)}
		</div>
	);
}

const GetUserInfo = ({ onEdit, onChangePassword }) => {
	const { authUser } = useAuthContext();
	
	return (
		<div className='flex flex-col flex-1'>
			<div className='flex gap-3 justify-between items-center'>
				<p className='font-bold text-red-400'>Your Profile</p>
				<button 
					onClick={onEdit}
					className='btn btn-xs btn-ghost text-blue-400 hover:text-blue-300'
				>
					✏️ Edit
				</button>
			</div>
			<div className="card bg-base-100 w-full shadow-xl flex flex-col items-center justify-center p-3 mt-2">
				<div className="avatar online">
					<div className='w-16 rounded-full'>
						<img src={authUser.profilepic} alt='user avatar' />
					</div>
				</div>
				<div className='flex flex-col items-center mt-2'>
					<p className='font-bold text-gray-200'>{authUser.fullName}</p>
					<p className='text-sm text-gray-400'>@{authUser.username}</p>
				</div>
				<button 
					onClick={onChangePassword}
					className='btn btn-xs btn-outline btn-warning mt-3'
				>
					🔒 Change Password
				</button>
			</div>
		</div>
	);
};

const EditProfileForm = ({ onClose }) => {
	const { authUser } = useAuthContext();
	const { loading, editProfile } = useEditProfile();
	
	const [inputs, setInputs] = useState({
		fullName: authUser.fullName || "",
		username: authUser.username || "",
		profilepic: authUser.profilepic || "",
		gender: authUser.gender || "male",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await editProfile(inputs);
		if (result) {
			onClose();
		}
	};

	return (
		<div className='flex flex-col'>
			<div className='flex gap-3 justify-between items-center mb-3'>
				<p className='font-bold text-blue-400'>Edit Profile</p>
				<button 
					onClick={onClose}
					className='btn btn-xs btn-ghost text-red-400 hover:text-red-300'
				>
					✕ Cancel
				</button>
			</div>
			
			<form onSubmit={handleSubmit} className='space-y-3'>
				{/* Profile Picture Preview */}
				<div className='flex justify-center'>
					<div className="avatar">
						<div className='w-16 rounded-full'>
							<img src={inputs.profilepic || authUser.profilepic} alt='avatar preview' />
						</div>
					</div>
				</div>

				{/* Full Name */}
				<div>
					<label className='label p-1'>
						<span className='text-xs label-text'>Full Name</span>
					</label>
					<input
						type='text'
						placeholder='Full Name'
						className='w-full input input-bordered input-sm h-8'
						value={inputs.fullName}
						onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
					/>
				</div>

				{/* Username */}
				<div>
					<label className='label p-1'>
						<span className='text-xs label-text'>Username</span>
					</label>
					<input
						type='text'
						placeholder='Username'
						className='w-full input input-bordered input-sm h-8'
						value={inputs.username}
						onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
					/>
				</div>

				{/* Profile Picture URL */}
				<div>
					<label className='label p-1'>
						<span className='text-xs label-text'>Profile Picture URL</span>
					</label>
					<input
						type='text'
						placeholder='https://example.com/image.png'
						className='w-full input input-bordered input-sm h-8'
						value={inputs.profilepic}
						onChange={(e) => setInputs({ ...inputs, profilepic: e.target.value })}
					/>
				</div>

				{/* Gender */}
				<div className='flex gap-4'>
					<label className='label gap-2 cursor-pointer'>
						<span className='text-xs label-text'>Male</span>
						<input
							type='checkbox'
							className='checkbox checkbox-sm border-slate-900'
							checked={inputs.gender === "male"}
							onChange={() => setInputs({ ...inputs, gender: "male" })}
						/>
					</label>
					<label className='label gap-2 cursor-pointer'>
						<span className='text-xs label-text'>Female</span>
						<input
							type='checkbox'
							className='checkbox checkbox-sm border-slate-900'
							checked={inputs.gender === "female"}
							onChange={() => setInputs({ ...inputs, gender: "female" })}
						/>
					</label>
				</div>

				{/* Submit Button */}
				<button 
					type='submit' 
					className='btn btn-sm btn-primary w-full'
					disabled={loading}
				>
					{loading ? <span className='loading loading-spinner loading-sm'></span> : "Save Changes"}
				</button>
			</form>
		</div>
	);
};

const ChangePasswordModal = ({ onClose }) => {
	const { loading, changePassword } = useEditProfile();
	
	const [inputs, setInputs] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await changePassword(inputs);
		if (success) {
			onClose();
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-gray-800 p-6 rounded-lg shadow-xl w-80'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='font-bold text-lg text-white'>Change Password</h3>
					<button 
						onClick={onClose}
						className='btn btn-xs btn-ghost text-red-400'
					>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-3'>
					<div>
						<label className='label p-1'>
							<span className='text-xs label-text'>Current Password</span>
						</label>
						<input
							type='password'
							placeholder='Current password'
							className='w-full input input-bordered input-sm h-9'
							value={inputs.currentPassword}
							onChange={(e) => setInputs({ ...inputs, currentPassword: e.target.value })}
						/>
					</div>

					<div>
						<label className='label p-1'>
							<span className='text-xs label-text'>New Password</span>
						</label>
						<input
							type='password'
							placeholder='New password'
							className='w-full input input-bordered input-sm h-9'
							value={inputs.newPassword}
							onChange={(e) => setInputs({ ...inputs, newPassword: e.target.value })}
						/>
					</div>

					<div>
						<label className='label p-1'>
							<span className='text-xs label-text'>Confirm New Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm new password'
							className='w-full input input-bordered input-sm h-9'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					<div className='flex gap-2 mt-4'>
						<button 
							type='button'
							onClick={onClose}
							className='btn btn-sm btn-ghost flex-1'
						>
							Cancel
						</button>
						<button 
							type='submit' 
							className='btn btn-sm btn-warning flex-1'
							disabled={loading}
						>
							{loading ? <span className='loading loading-spinner loading-sm'></span> : "Change"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};