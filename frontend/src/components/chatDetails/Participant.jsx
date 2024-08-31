import React, { useState } from "react";
import { useSelector } from "react-redux";

// Subcomponents
import ParticipantAdd from "./ParticipantAdd";
import ParticipantDelete from "./ParticipantDelete";

const Participant = () => {
	const selectedChat = useSelector((state) => state?.myChat?.selectedChat);
	const [isAddingMember, setIsAddingMember] = useState(false);

	const renderMemberComponent = () => {
		return isAddingMember ? (
			<ParticipantAdd setMemberAddBox={setIsAddingMember} />
		) : (
			<ParticipantDelete setMemberAddBox={setIsAddingMember} />
		);
	};

	return (
		<div className="relative flex flex-col h-full pt-2 gap-2 text-white z-10 overflow-auto scroll-style">
			<div className="mt-2 text-lg font-semibold w-full text-center">
				Participants ({selectedChat?.users?.length})
			</div>
			{renderMemberComponent()}
		</div>
	);
};

export default Participant;
