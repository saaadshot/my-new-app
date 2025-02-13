/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import NewWindowContent from "./components/NewWindowContent";

const container = document.getElementById("root");
if (!container) {
	throw new Error("Root element not found");
}

const root = createRoot(container);

// Check if this is a new window by looking for the 'type' parameter in the URL
const urlParams = new URLSearchParams(window.location.search);
const isNewWindow = urlParams.get("type") === "new";

root.render(React.createElement(isNewWindow ? NewWindowContent : App));
