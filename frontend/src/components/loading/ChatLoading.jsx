import React from "react";

const loadingElements = Array.from({ length: 6 });

const ChatLoading = () => {
	return (
		<>
			{loadingElements.map((_, index) => (
				<div
					key={index}
					className="w-full h-16 border border-green-500 rounded-lg flex items-center p-2 gap-2 font-semibold text-white hover:bg-black/50 cursor-pointer transition-all"
				>
					<div className="h-12 w-12 rounded-full border border-green-600 loading-animation"></div>
					<div className="flex flex-col w-full">
						<div className="h-3 w-3/4 mb-3.5 rounded-lg border border-green-600 loading-animation"></div>
						<div className="h-3 w-1/2 rounded-lg border border-green-600 loading-animation"></div>
					</div>
				</div>
			))}
		</>
	);
};

export const ChatLoadingSmall = () => {
	return (
		<>
			{loadingElements.map((_, index) => (
				<div
					key={index}
					className="w-full h-12 border border-green-500 rounded-lg flex items-center p-2 gap-2 font-semibold text-white hover:bg-black/50 cursor-pointer transition-all"
				>
					<div className="h-10 w-10 rounded-full border border-green-600 loading-animation"></div>
					<div className="h-3 w-3/4 rounded-lg border border-green-600 loading-animation"></div>
					<div className="h-8 w-8 rounded-lg border border-green-600 loading-animation"></div>
				</div>
			))}
		</>
	);
};

export default ChatLoading;
