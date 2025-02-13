import { app, BrowserWindow, ipcMain, desktopCapturer } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

let mainWindow: BrowserWindow | null = null;

// Register IPC handlers before window creation
// Handle screen capture request
ipcMain.handle("get-screenshot", async () => {
	try {
		const sources = await desktopCapturer.getSources({
			types: ["window"],
			thumbnailSize: { width: 1920, height: 1080 },
		});
		const currentWindow = sources.find(
			(source) =>
				source.name === "Electron Window Manager" ||
				source.name.includes("my-new-app")
		);
		return currentWindow ? currentWindow.thumbnail.toDataURL() : "";
	} catch (error) {
		console.error("Screenshot error:", error);
		return "";
	}
});

// Handle click logging
ipcMain.on("log-click", (event, data) => {
	if (mainWindow) {
		mainWindow.webContents.send("update-log", {
			timestamp: new Date().toLocaleTimeString(),
			...data,
		});
	}
});

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	// and load the index.html of the app.
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(
			path.join(
				__dirname,
				`../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
			)
		);
	}

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// Add handler for new window creation
ipcMain.on("open-new-window", () => {
	const newWindow = new BrowserWindow({
		width: 600,
		height: 400,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		newWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}?type=new`);
	} else {
		const filePath = path.join(
			__dirname,
			`../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
		);
		newWindow.loadFile(filePath, { query: { type: "new" } });
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
