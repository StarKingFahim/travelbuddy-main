import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setLoading,
	setChatLoading,
	setGroupChatBox,
	setGroupChatId,
} from "../../redux/slices/conditionSlice";
import ChatLoading from "../loading/ChatLoading";

import { MdOutlineClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

import { handleScrollEnd } from "../../utils/handleScrollTop";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const GroupChatBox = () => {

	const dispatch = useDispatch();
	const groupUserRef = useRef("");
	const isChatLoading = useSelector((state) => state?.condition?.isChatLoading);
	const authUserId = useSelector((state) => state?.auth?._id);

	const [groupMembers, setGroupMembers] = useState([]);
	const [groupName, setGroupName] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchUsers = () => {
			dispatch(setChatLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((data) => {
					setUsers(data.data || []);
					setFilteredUsers(data.data || []);
					dispatch(setChatLoading(false));
				})
				.catch((error) => {
					console.error(error);
					dispatch(setChatLoading(false));
				});
		};

		fetchUsers();
	}, [dispatch]);

	useEffect(() => {
		const filtered = users.filter((user) =>
			[`${user.firstName} ${user.lastName}`, user.email]
				.join(" ")
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		);
		setFilteredUsers(filtered);
	}, [searchTerm, users]);

	useEffect(() => {
		handleScrollEnd(groupUserRef.current);
	}, [groupMembers]);

	const addMemberToGroup = (user) => {
		if (!groupMembers.some((member) => member._id === user._id)) {
			setGroupMembers([...groupMembers, user]);
		} else {
			toast.warn(`"${user.firstName}" is already added.`);
		}
	};

	const removeMemberFromGroup = (userId) => {
		setGroupMembers(groupMembers.filter((member) => member._id !== userId));
	};

	const createGroupChat = async () => {
		if (groupMembers.length < 2) {
			toast.warn("Please select at least 2 users");
			return;
		}

		if (!groupName.trim()) {
			toast.warn("Please enter a group name");
			return;
		}

		dispatch(setGroupChatBox());
		dispatch(setLoading(true));

		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: groupName.trim(),
				users: groupMembers,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				dispatch(addSelectedChat(data.data));
				dispatch(setGroupChatId(data.data._id));
				dispatch(setLoading(false));
				socket.emit("chat created", data.data, authUserId);
				toast.success("Created and selected chat");
			})
			.catch((error) => {
				console.error(error);
				toast.error(error.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<div className=" z-50 -m-2 fixed top-0 w-full min-h-screen flex items-center justify-center sm:-m-4 my-6 text-white">

			<div className="relative mt-5 p-3 pt-4 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] bg-green-800 border rounded-lg h-fit transition-all">

				<h2 className="text-3xl text-center mb-2">
					Create a Room
				</h2>

				<div className="flex flex-wrap items-center justify-evenly gap-3 w-full py-4">

					<div className="flex items-center justify-center w-full gap-3">
						<input
							id="search"
							className=" bg-transparent w-2/3 py-2 px-3 font-normal rounded-md outline-none cursor-pointer active:bg-black/30 border border-white"
							type="text"
							placeholder="Start typing!"
							onChange={(e) => setSearchTerm(e.target.value)}
							value={searchTerm}
						/>

						<label htmlFor="search" className="cursor-pointer">
							<FaSearch title="Search Participants!" />
						</label>
					</div>


					<div
						ref={groupUserRef}
						className="flex gap-1 w-full px-4 py-2 overflow-auto scroll-style-x"
					>
						{groupMembers.length > 0 &&
							groupMembers.map((user) => (
								<div
									key={user._id}
									className="flex items-center justify-center my-1 gap-1 py-1 px-2 font-normal bg-transparent border border-green-600 rounded-md cursor-pointer active:bg-black/20"
								>
									<h1>{user.firstName}</h1>
									<div
										title={`Remove ${user.firstName}`}
										onClick={() =>
											removeMemberFromGroup(user._id)
										}
										className="flex items-center justify-center h-6 w-6 m-0.5 bg-black/15 hover:bg-black/50 rounded-md cursor-pointer"
									>
										<MdOutlineClose size={18} />
									</div>
								</div>
							))}
					</div>

					<div className="flex flex-col w-full px-4 py-2 overflow-y-auto overflow-hidden scroll-style h-[50vh]">
						{filteredUsers.length === 0 && isChatLoading ? (
							<ChatLoading />
						) : (
							<>
								{filteredUsers.length === 0 ? (
									<div className="flex items-center justify-center w-full h-full text-white">
										<h1 className="text-base font-semibold">
											No users registered.
										</h1>
									</div>
								) : (
									filteredUsers.map((user) => (
										<div
											key={user._id}
											className="flex items-center justify-start w-full h-16 p-2 font-semibold text-black bg-transparent border border-green-500 rounded-lg cursor-pointer hover:bg-black/50 transition-all"
											onClick={() => {
												addMemberToGroup(user);
												setSearchTerm("");
											}}
										>
											<img
												className="h-12 rounded-full min-w-12"
												src={user.image}
												alt="user"
											/>
											<div className="w-full">
												<span className="capitalize line-clamp-1">
													{user.firstName}{" "}
													{user.lastName}
												</span>
												<span className="text-xs font-light">
													{SimpleDateAndTime(
														user.createdAt
													)}
												</span>
											</div>
										</div>
									))
								)}
							</>
						)}
					</div>
				</div>
				<div className="flex items-center justify-center gap-2 w-full">
					<input
						type="text"
						placeholder="Room Name"
						className="w-2/3 py-1 px-2 font-normal bg-transparent border border-green-600 rounded-md outline-none cursor-pointer active:bg-black/20"
						onChange={(e) => setGroupName(e.target.value)}
					/>
					<button
						className="py-1 px-2 font-semibold text-black bg-green-400 border border-green-600 rounded-lg hover:text-white hover:bg-green-700"
						onClick={createGroupChat}
					>
						Create
					</button>
				</div>
				<div
					title="Close"
					onClick={() => dispatch(setGroupChatBox())}
					className="absolute top-3 right-3 flex items-center justify-center h-7 w-7 bg-black/15 hover:bg-black/50 rounded-md cursor-pointer"
				>
					<MdOutlineClose size={22} />
				</div>
			</div>
		</div>
	);
};

export default GroupChatBox;
