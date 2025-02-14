import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

// Initialize openWindows function
let openWindows: any;
(async () => {
	const getWindows = await import("get-windows");
	openWindows = getWindows.openWindows;
})().catch(console.error);

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

interface WindowInfo {
	title: string;
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	owner: {
		name: string;
		processId: number;
		bundleId?: string;
		path: string;
	};
	memoryUsage: number;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

let mainWindow: BrowserWindow | null = null;

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

// Add window tracking functionality
let windowTrackingInterval: NodeJS.Timeout | null = null;

const trackWindows = async () => {
	try {
		if (!openWindows) {
			console.log("Waiting for openWindows to initialize...");
			return;
		}
		const windows = (await openWindows()) as WindowInfo[];
		if (mainWindow) {
			mainWindow.webContents.send(
				"update-windows",
				windows.map((window: WindowInfo) => ({
					title: window.title,
					bounds: window.bounds,
					processId: window.owner.processId,
					path: window.owner.path,
					isVisible: true,
					isMinimized: false,
				}))
			);
		}
	} catch (error) {
		console.error("Error tracking windows:", error);
	}
};

// Start window tracking when the app is ready
app.on("ready", () => {
	createWindow();

	// Start tracking windows every second
	windowTrackingInterval = setInterval(trackWindows, 1000);
});

// Clean up interval when app quits
app.on("before-quit", () => {
	if (windowTrackingInterval) {
		clearInterval(windowTrackingInterval);
	}
});

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
