import React, { useEffect, useState } from "react";
import NewWindowButton from "./components/NewWindowButton";
import TestElements from "./components/TestElements";

interface WindowInfo {
	title: string;
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	processId: number;
	path: string;
	isVisible: boolean;
	isMinimized: boolean;
}

const App: React.FC = () => {
	const [windows, setWindows] = useState<WindowInfo[]>([]);

	useEffect(() => {
		const handleWindows = (_: any, data: WindowInfo[]) => {
			setWindows(data);
		};

		window.electron.ipcRenderer.on("update-windows", handleWindows);

		return () => {
			window.electron.ipcRenderer.removeListener(
				"update-windows",
				handleWindows
			);
		};
	}, []);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				minHeight: "100vh",
				backgroundColor: "#f5f5f5",
				padding: "20px",
				overflowY: "auto",
			}}
		>
			<h1>Electron Window Manager</h1>
			<NewWindowButton buttonText="Create New Window" />
			<TestElements />

			{/* Windows List */}
			<div
				style={{
					marginTop: "20px",
					width: "100%",
					maxWidth: "800px",
					backgroundColor: "white",
					padding: "20px",
					borderRadius: "8px",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
					marginBottom: "20px",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "15px",
					}}
				>
					<h2 style={{ margin: 0 }}>Active Windows</h2>
					<button
						onClick={() => setWindows([])}
						style={{
							padding: "8px 16px",
							backgroundColor: "#dc3545",
							color: "white",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							fontSize: "14px",
							transition: "background-color 0.3s",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = "#c82333";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = "#dc3545";
						}}
					>
						Clear List
					</button>
				</div>
				<div style={{ maxHeight: "300px", overflowY: "auto" }}>
					{windows.map((window, index) => (
						<div
							key={index}
							style={{
								padding: "10px",
								marginBottom: "10px",
								backgroundColor: "#f8f9fa",
								borderRadius: "4px",
								fontSize: "14px",
							}}
						>
							<div>
								<strong>Title:</strong> {window.title}
							</div>
							<div>
								<strong>Process ID:</strong> {window.processId}
							</div>
							<div>
								<strong>Path:</strong> {window.path}
							</div>
							<div>
								<strong>Position:</strong> ({window.bounds.x},{" "}
								{window.bounds.y})
							</div>
							<div>
								<strong>Size:</strong> {window.bounds.width}x
								{window.bounds.height}
							</div>
							<div>
								<strong>State:</strong>{" "}
								{window.isMinimized
									? "Minimized"
									: window.isVisible
									? "Visible"
									: "Hidden"}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default App;
