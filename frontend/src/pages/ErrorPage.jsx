import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
	return (
		<div className="w-full h-dvh text-black flex flex-col items-center justify-center text-center">
			<h1 className="text-3xl sm:text-2xl text-black font-bold">
				Oops! Something went wrong!
			</h1>
			<h1 className="text-2xl sm:text-xl text-black font-bold">404 Bad request</h1>
			<Link
				className="text-2xl sm:text-xl text-black underline underline-offset-600 hover:text-green-800 py-2"
				to={"/"}
			>
				Return back to Home!
			</Link>
		</div>
	);
};

export default ErrorPage;
