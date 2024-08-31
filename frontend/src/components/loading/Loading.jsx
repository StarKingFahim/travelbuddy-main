import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/conditionSlice";

const Loading = () => {
	const dispatch = useDispatch();
	const [isCancelable, setIsCancelable] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsCancelable(true);
		}, 10000);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	return (
		<div className="fixed top-0 w-full min-h-screen flex flex-col items-center justify-center z-50 bg-black/60 text-green-300">
			
			<div id="loader"></div>

			{isCancelable && (
				<div className="mt-5 h-10 w-24 flex justify-center items-center">
					<button
						onClick={() => dispatch(setLoading(false))}
						className="py-2 px-4 border border-green-700 rounded-md bg-green-900 hover:bg-black/80 font-bold cursor-pointer"
					>
						Cancel
					</button>
				</div>
			)}
		</div>
	);
};

export default Loading;
