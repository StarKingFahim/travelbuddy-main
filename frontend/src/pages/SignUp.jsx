import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateSignUpForm } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [loadingText, setLoadingText] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const registerUser = (e) => {
		toast.loading("Processing your sign-up...");
		e.target.disabled = true;
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then((data) => {
				setLoadingText("");
				e.target.disabled = false;
				toast.dismiss();
				if (data.token) {
					navigate("/signin");
					toast.success(data.message);
				} else {
					toast.error(data.message);
				}
			})
			.catch((error) => {
				console.error("Sign-up failed:", error);
				setLoadingText("");
				toast.dismiss();
				toast.error("Error: " + error.code);
				e.target.disabled = false;
			});
	};

	const handleSubmit = (e) => {
		if (Object.values(formData).every(field => field !== "")) {
			const validationError = validateSignUpForm(
				formData.firstName,
				formData.lastName,
				formData.email,
				formData.password
			);
			if (validationError) {
				toast.error(validationError);
				return;
			}
			setLoadingText("Loading...");
			registerUser(e);
		} else {
			toast.error("All fields are required");
		}
	};

	return (
		<div className="flex flex-col items-center text-white my-6 min-h-[80vh]">
			<div className="p-6 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] border border-green-400 bg-green-800 rounded-lg h-fit mt-5 transition-all">
				<h2 className="text-2xl font-bold text-white w-full text-center mb-4">
					Join TravelBuddy
				</h2>
				<form className="w-full flex flex-col justify-between">
					<label className="text-xl font-semibold p-1" htmlFor="firstName">
						First Name
					</label>
					<input
						className="w-full border border-green-700 my-3 py-4 px-8 rounded-full bg-white text-black"
						type="text"
						placeholder="Enter First Name"
						name="firstName"
						value={formData.firstName}
						onChange={handleChange}
						required
					/>
					<label className="text-xl font-semibold p-1" htmlFor="lastName">
						Last Name
					</label>
					<input
						className="w-full border border-green-700 my-3 py-4 px-8 rounded-full bg-white text-black"
						type="text"
						placeholder="Enter Last Name"
						name="lastName"
						value={formData.lastName}
						onChange={handleChange}
						required
					/>
					<label className="text-xl font-semibold p-1" htmlFor="email">
						Email Address
					</label>
					<input
						className="w-full border border-green-700 my-3 py-4 px-8 rounded-full bg-white text-black"
						type="email"
						placeholder="Enter Email Address"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
					<label className="text-xl font-semibold p-1" htmlFor="password">
						Password
					</label>
					<div className="relative">
						<input
							className="w-full border border-green-700 my-3 py-4 px-8 rounded-full bg-white text-black"
							type={showPassword ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={formData.password}
							onChange={handleChange}
						/>
						<span
							onClick={() => setShowPassword(!showPassword)}
							className="cursor-pointer text-black/80 absolute right-5 top-8"
						>
							{showPassword ? <PiEyeClosedLight fontSize={22} /> : <PiEye fontSize={22} />}
						</span>
					</div>
					<button
						onClick={(e) => {
							handleSubmit(e);
							e.preventDefault();
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:bg-white rounded-full px-5 py-4 mt-5 text-lg border hover:text-black bg-green-700 transition-all"
					>
						{loadingText === "" ? "Sign Up" : loadingText}
					</button>

					<Link to="/signin">
						<div className="text-center disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:bg-white rounded-full px-5 py-4 mt-5 text-lg border hover:text-black bg-green-700 transition-all">
							Sign In
						</div>
					</Link>

				</form>
			</div>
		</div>
	);
};

export default SignUp;
