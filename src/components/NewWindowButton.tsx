import React from "react";

interface NewWindowButtonProps {
	buttonText?: string;
}

const NewWindowButton: React.FC<NewWindowButtonProps> = ({
	buttonText = "Open New Window",
}) => {
	const handleOpenWindow = () => {
		// Using the exposed electron API through contextBridge
		window.electron.openNewWindow();
	};

	return (
		<button
			onClick={handleOpenWindow}
			style={{
				padding: "10px 20px",
				fontSize: "16px",
				borderRadius: "5px",
				backgroundColor: "#4CAF50",
				color: "white",
				border: "none",
				cursor: "pointer",
				transition: "background-color 0.3s",
			}}
			onMouseOver={(e) => {
				e.currentTarget.style.backgroundColor = "#45a049";
			}}
			onMouseOut={(e) => {
				e.currentTarget.style.backgroundColor = "#4CAF50";
			}}
		>
			{buttonText}
		</button>
	);
};

export default NewWindowButton;
