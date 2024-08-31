import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";

import { MdOutlineClose } from "react-icons/md";
import { toast } from "react-toastify";

const Profile = () => {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.auth);

	const handleCloseClick = () => {
		dispatch(setProfileDetail());
	};

	return (
		<div className="flex fixed top-0 w-full min-h-screen items-center justify-center z-50 -m-2 sm:-m-4 my-6">
			<div className="w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] relative mt-5 p-3 pt-4  bg-green-700 border border-slate-400 rounded-xl h-fit transition-all">

				<h2 className="text-2xl font-semibold text-white w-full text-center mb-3">
					My Profile
				</h2>

				<div className="w-full py-4 flex flex-wrap gap-2  justify-evenly items-center">
					<div className="self-end">
						<h4 className="text-xl font-semibold p-1">
							Name:
							<span className="font-normal"> {user.firstName} {user.lastName} </span>
						</h4>
						<h4 className="text-xl font-semibold p-1">
							Email:
							<span className="font-normal"> {user.email} </span>
						</h4>
					</div>

					<div className="flex w-full sm:w-fit items-center align-center justify-evenly sm:flex-col">
						<img
							src={user.image}
							alt="user"
							className="w-20 h-20 rounded-md"
						/>
					</div>

				</div>

				<div
					title="Close"
					onClick={handleCloseClick}
					className="absolute top-2 right-3 flex items-center justify-center h-7 w-7 bg-white/15 hover:bg-white/30 rounded-full cursor-pointer"
				>
					<MdOutlineClose size={22} />
				</div>
			</div>
		</div>
	);
};

export default Profile;
