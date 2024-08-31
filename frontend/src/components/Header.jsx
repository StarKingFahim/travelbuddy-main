import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
} from "react-icons/md";

import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";

import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";

const Header = () => {

	const showHeaderMenu = useSelector((store) => store?.condition?.showHeaderMenu);

	const messageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);

	const user = useSelector((store) => store.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const token = localStorage.getItem("token");

	const getAuthUser = async (token) => {
		try {
			dispatch(setLoading(true));

			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const json = await response.json();
			dispatch(addAuth(json.data));
		} catch (err) {
			console.error(err);
		} finally {
			dispatch(setLoading(false));
		}
	};


	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		} else {
			navigate("/signin");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);


	const { pathname } = useLocation();


	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	useEffect(() => {
		if (user) {
			navigate("/");
		} else if (pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user]);

	useEffect(() => {
		var prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			var currentScrollPos = window.pageYOffset;
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				document.getElementById("header").classList.add("hiddenbox");
			} else {
				document.getElementById("header").classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);
	// headerMenuBox outside click handler
	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	useEffect(() => {
		if (showHeaderMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showHeaderMenu]);


	return (
		<div
			id="header"
			className="w-full z-100 md:h-20 flex justify-between items-center p-4 font-semibold text-black h-20 fixed top-0"
		>
			<div className="flex items-center justify-start gap-3">
				<Link to={"/"}>
					<img
						src={Logo}
						alt="TravelBuddy logo"
						className="h-12 w-12 rounded-full rounded-br-full"
					/>
				</Link>
				<Link to={"/"}>
					<span className="font-bold text-green">TravelBuddy</span>
				</Link>
			</div>

			{user ? (
				<div className="flex flex-nowrap items-center">
					<span
						className={`whitespace-nowrap mr-1.5 ml-2 flex items-center justify-center relative cursor-pointer ${messageRecieved.length > 0
							? "animate-bounce"
							: "animate-none"
							}`}
						onClick={() => dispatch(setNotificationBox(true))}
						title={`New ${messageRecieved.length} notifications`}
					>
						<MdNotificationsActive fontSize={25} />
						<span className="font-semibold text-xs absolute top-0 right-0 translate-x-1.5 -translate-y-1.5">
							{messageRecieved.length}
						</span>
					</span>
					<span className="whitespace-nowrap ml-2">
						Hi, {user.firstName}
					</span>
					<div
						ref={headerUserBox}
						onClick={(e) => {
							e.preventDefault();
							dispatch(setHeaderMenu(!showHeaderMenu));
						}}
						className="flex flex-nowrap transition-all items-center ml-3  border border-green-400 rounded-full  text-black shadow-sm  cursor-pointer"
					>
						<img
							src={user.image}
							alt="My Image"
							className="w-10 h-10 rounded-full"
						/>
						<span className="m-2">
							{showHeaderMenu ? (
								<MdKeyboardArrowDown fontSize={20} />
							) : (
								<MdKeyboardArrowUp fontSize={20} />
							)}
						</span>
					</div>

					{showHeaderMenu && (
						<div
							ref={headerMenuBox}
							className="z-150 border bg-white text-black w-40 h-24 py-2 flex flex-col  rounded-md gap-1 absolute top-16 right-4"
						>
							<div
								onClick={() => {
									dispatch(setHeaderMenu(false));
									dispatch(setProfileDetail());
								}}
								className="flex flex-nowrap w-full h-fit cursor-pointer p-2"
							>
								<div className="flex w-full">
									<PiUserCircleLight fontSize={24} />
									<span>Profile</span>
								</div>
							</div>

							<div
								className="flex flex-nowrap  w-full h-fit cursor-pointer  p-2"
								onClick={handleLogout}
							>
								<div className="flex  w-full">
									<IoLogOutOutline fontSize={24} />
									<span>Sing Out</span>
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				<Link to={"/signin"}>
					<button className="py-2 px-4 border rounded-full bg-green text-black shadow-sm hover:bg-green-400">
						Sign in
					</button>
				</Link>
			)}
		</div>
	);
};

export default Header;
