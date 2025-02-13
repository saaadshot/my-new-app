import React, { useEffect, useState } from "react";
import NewWindowButton from "./components/NewWindowButton";
import TestElements from "./components/TestElements";

interface LogEntry {
	timestamp: string;
	x: number;
	y: number;
	elementInfo: string;
	screenshot?: string;
}

const App: React.FC = () => {
	const [logs, setLogs] = useState<LogEntry[]>([]);

	useEffect(() => {
		const handleLog = async (_: any, data: LogEntry) => {
			const screenshot = await window.electron.captureScreenshot();
			setLogs((prev) => [...prev, { ...data, screenshot }]);
		};

		window.electron.ipcRenderer.on("update-log", handleLog);

		return () => {
			window.electron.ipcRenderer.removeListener("update-log", handleLog);
		};
	}, []);

	const handleClick = async (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		const testId = target.getAttribute("data-testid");

		// Special handling for input elements
		let elementInfo = target.tagName;
		if (testId) {
			elementInfo += ` [${testId}]`;
		}
		if (target.tagName === "INPUT" || target.tagName === "SELECT") {
			elementInfo += ` - ${
				(target as HTMLInputElement).placeholder ||
				(target as HTMLSelectElement).value ||
				target.tagName
			}`;
		} else if (target.textContent) {
			elementInfo += ` - ${target.textContent.trim()}`;
		}

		window.electron.logClick(e.clientX, e.clientY, elementInfo);
	};

	return (
		<div
			onClick={handleClick}
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

			<div
				style={{
					marginTop: "20px",
					width: "100%",
					maxWidth: "800px",
					backgroundColor: "white",
					padding: "20px",
					borderRadius: "8px",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
					maxHeight: "600px",
					overflowY: "auto",
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
					<h2 style={{ margin: 0 }}>Activity Log</h2>
					<button
						onClick={() => {
							setLogs([]);
						}}
						style={{
							padding: "8px 16px",
							backgroundColor: "#6c757d",
							color: "white",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
						}}
					>
						Clear Log
					</button>
				</div>
				{logs.map((log, index) => (
					<div
						key={index}
						style={{
							marginBottom: "10px",
							padding: "10px",
							backgroundColor: "#f8f9fa",
							borderRadius: "4px",
						}}
					>
						<div>Time: {log.timestamp}</div>
						<div>
							Position: ({log.x}, {log.y})
						</div>
						<div>Element: {log.elementInfo}</div>
						{log.screenshot && (
							<img
								src={log.screenshot}
								alt="Screenshot"
								style={{
									marginTop: "10px",
									maxWidth: "100%",
									height: "auto",
									borderRadius: "4px",
								}}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default App;
