import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { PiEyeClosedLight, PiEye } from "react-icons/pi";
import { toast } from "react-toastify";
import { validateSignInCredentials } from "../utils/validate";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSignIn = async (e) => {
		toast.loading("Processing...");
		e.target.disabled = true;

		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const result = await response.json();

			setLoading(false);
			e.target.disabled = false;
			toast.dismiss();

			if (result.token) {
				localStorage.setItem("token", result.token);
				dispatch(addAuth(result.data));
				navigate("/");
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			console.error("Error:", error);
			setLoading(false);
			toast.dismiss();
			toast.error(`Error: ${error.message}`);
			e.target.disabled = false;
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Please fill in all fields.");
			return;
		}

		const validationError = validateSignInCredentials(email, password);
		if (validationError) {
			toast.error(validationError);
			return;
		}

		setLoading(true);
		handleSignIn(e);
	};

	return (
		<div className="flex flex-col items-center min-h-[80vh] my-6 text-white">
			<div className="bg-green-800 border border-green-400 rounded-lg w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] p-6 mt-5 max-w-[1000px] min-w-72 transition-all">
				<h2 className="text-2xl font-semibold text-center mb-4">Sign In TravelBuddy</h2>
				<form onSubmit={onSubmit} className="flex flex-col w-full">
					<label className="text-xl font-semibold p-1">Email Address</label>
					<input
						type="email"
						placeholder="Enter Email Address"
						className="w-full my-3 py-4 px-8 rounded-full border border-green-700 bg-white text-black"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<label className="text-xl font-semibold p-1">Password</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Enter Password"
							className="w-full my-3 py-4 px-8 rounded-full border border-green-700 bg-white text-black"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span
							className="absolute right-5 top-8 cursor-pointer text-black/70"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <PiEyeClosedLight fontSize={22} /> : <PiEye fontSize={22} />}
						</span>
					</div>

					<button
						type="submit"
						className="mt-5 w-full py-4 rounded-full font-semibold text-lg bg-green-700 border border-green-400 text-white-400 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Loading..." : "Sign In"}
					</button>

					<Link to="/signup" className="mt-5">
						<div className="text-center py-4 rounded-full font-semibold text-lg bg-green-700 border border-green-400 text-white-400 hover:bg-white hover:text-black">
							Sign up
						</div>
					</Link>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
