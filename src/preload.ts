// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

interface IpcRenderer {
	on(channel: string, func: (...args: any[]) => void): void;
	removeListener(channel: string, func: (...args: any[]) => void): void;
}

declare global {
	interface Window {
		electron: {
			openNewWindow: () => void;
			captureScreenshot: () => Promise<string>;
			logClick: (x: number, y: number, elementInfo: string) => void;
			ipcRenderer: IpcRenderer;
		};
	}
}

contextBridge.exposeInMainWorld("electron", {
	openNewWindow: () => ipcRenderer.send("open-new-window"),
	captureScreenshot: () => ipcRenderer.invoke("get-screenshot"),
	logClick: (x: number, y: number, elementInfo: string) => {
		ipcRenderer.send("log-click", { x, y, elementInfo });
	},
	ipcRenderer: {
		on: (channel: string, func: (...args: any[]) => void) => {
			ipcRenderer.on(channel, func);
		},
		removeListener: (channel: string, func: (...args: any[]) => void) => {
			ipcRenderer.removeListener(channel, func);
		},
	},
});
