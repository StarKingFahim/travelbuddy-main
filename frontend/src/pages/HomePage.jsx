import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatIsNotSelected from "../components/chatComponents/ChatIsNotSelected";
import {
	setChatDetailsBox,
	setSocketConnected,
	setUserSearchBox,
} from "../redux/slices/conditionSlice";
import socket from "../socket/socket";
import { addAllMessages, addNewMessage } from "../redux/slices/messageSlice";
import {
	addNewChat,
	addNewMessageRecieved,
	deleteSelectedChat,
} from "../redux/slices/myChatSlice";
import { toast } from "react-toastify";
import { receivedSound } from "../utils/notificationSound";

// Icons
import { MdChat } from "react-icons/md";

let currentChat;

const HomePage = () => {
	const selectedChat = useSelector((state) => state?.myChat?.selectedChat);
	const dispatch = useDispatch();
	const isSearchBoxVisible = useSelector(
		(state) => state?.condition?.isUserSearchBox
	);
	const authUserId = useSelector((state) => state?.auth?._id);

	// Establish socket connection
	useEffect(() => {
		if (!authUserId) return;
		socket.emit("setup", authUserId);
		socket.on("connected", () => dispatch(setSocketConnected(true)));
	}, [authUserId]);

	// Handle incoming messages via socket
	useEffect(() => {
		currentChat = selectedChat;
		const handleMessageReceived = (message) => {
			if (
				currentChat &&
				currentChat._id === message.chat._id
			) {
				dispatch(addNewMessage(message));
			} else {
				receivedSound();
				dispatch(addNewMessageRecieved(message));
			}
		};
		socket.on("message received", handleMessageReceived);

		return () => {
			socket.off("message received", handleMessageReceived);
		};
	}, [selectedChat]);

	// Handle chat clearance via socket
	useEffect(() => {
		const handleClearChat = (chatId) => {
			if (chatId === selectedChat?._id) {
				dispatch(addAllMessages([]));
				toast.success("All messages cleared");
			}
		};
		socket.on("clear chat", handleClearChat);
		return () => {
			socket.off("clear chat", handleClearChat);
		};
	}, [selectedChat]);

	// Handle chat deletion via socket
	useEffect(() => {
		const handleDeleteChat = (chatId) => {
			dispatch(setChatDetailsBox(false));
			if (selectedChat && chatId === selectedChat._id) {
				dispatch(addAllMessages([]));
			}
			dispatch(deleteSelectedChat(chatId));
			toast.success("Chat deleted");
		};
		socket.on("delete chat", handleDeleteChat);
		return () => {
			socket.off("delete chat", handleDeleteChat);
		};
	}, [selectedChat]);

	// Handle new chat creation via socket
	useEffect(() => {
		const handleChatCreated = (chat) => {
			dispatch(addNewChat(chat));
			toast.success("Chat created and selected");
		};
		socket.on("chat created", handleChatCreated);
		return () => {
			socket.off("chat created", handleChatCreated);
		};
	}, []);

	return (
		<div className="flex w-full rounded-md text-black shadow-md shadow-green border relative">
			<div
				className={`${
					selectedChat ? "hidden" : ""
				} sm:block w-full border-r  rounded-l-md sm:w-[50%] h-[80vh] bg-green/50 relative `}
			>
				<div className="absolute bottom-2 right-5 cursor-pointer text-white">
					<MdChat
						title="New Chat"
						fontSize={32}
						onClick={() => dispatch(setUserSearchBox())}
					/>
				</div>
				{isSearchBoxVisible ? <UserSearch /> : <MyChat />}
			</div>
			<div
				className={`${
					selectedChat ? "" : "hidden"
				} sm:block sm:w-[50%] h-[80vh]  w-full bg-green/50 relative overflow-hidden rounded-r-md`}
			>
				{selectedChat ? (
					<MessageBox chatId={selectedChat?._id} />
				) : (
					<ChatIsNotSelected />
				)}
			</div>
		</div>
	);
};

export default HomePage;
