import React from "react";
import NewWindowButton from "./components/NewWindowButton";

const App: React.FC = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				backgroundColor: "#f5f5f5",
			}}
		>
			<h1>Electron Window Manager</h1>
			<NewWindowButton buttonText="Create New Window" />
		</div>
	);
};

export default App;
