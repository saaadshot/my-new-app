import React, { useState } from "react";

const TestElements: React.FC = () => {
	const [counter, setCounter] = useState(0);

	const handleCounterClick = (e: React.MouseEvent) => {
		setCounter((prev) => prev + 1);
		e.stopPropagation();
	};

	return (
		<div
			style={{
				width: "100%",
				maxWidth: "600px",
				backgroundColor: "white",
				padding: "20px",
				borderRadius: "8px",
				marginTop: "20px",
				boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
			}}
		>
			<h2>Test Elements</h2>

			{/* Buttons Section */}
			<div
				style={{
					display: "flex",
					gap: "10px",
					marginBottom: "20px",
					flexWrap: "wrap",
				}}
			>
				<button
					style={{
						padding: "8px 16px",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
					data-testid="primary-button"
				>
					Primary Button
				</button>
				<button
					style={{
						padding: "8px 16px",
						backgroundColor: "#dc3545",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
					data-testid="danger-button"
				>
					Danger Button
				</button>
				<button
					style={{
						padding: "8px 16px",
						backgroundColor: "#28a745",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
					onClick={handleCounterClick}
					data-testid="counter-button"
				>
					Counter: {counter}
				</button>
			</div>

			{/* Text Elements */}
			<div
				style={{
					marginBottom: "20px",
				}}
			>
				<p data-testid="test-paragraph">Click me! I'm a paragraph.</p>
				<span style={{ marginRight: "10px" }} data-testid="test-span">
					I'm a span element
				</span>
				<strong data-testid="test-strong">I'm bold text</strong>
			</div>

			{/* Interactive Elements */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<input
					type="text"
					placeholder="Click this input"
					style={{
						padding: "8px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
					data-testid="test-input"
				/>
				<select
					style={{
						padding: "8px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
					data-testid="test-select"
				>
					<option>Option 1</option>
					<option>Option 2</option>
					<option>Option 3</option>
				</select>
				<div
					style={{
						padding: "15px",
						backgroundColor: "#f8f9fa",
						borderRadius: "4px",
						cursor: "pointer",
						textAlign: "center",
					}}
					data-testid="test-div"
				>
					Clickable Div
				</div>
			</div>
		</div>
	);
};

export default TestElements;
