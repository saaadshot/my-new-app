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
			ipcRenderer: IpcRenderer;
		};
	}
}

contextBridge.exposeInMainWorld("electron", {
	openNewWindow: () => ipcRenderer.send("open-new-window"),
	ipcRenderer: {
		on: (channel: string, func: (...args: any[]) => void) => {
			if (channel === "update-windows") {
				ipcRenderer.on(channel, func);
			}
		},
		removeListener: (channel: string, func: (...args: any[]) => void) => {
			if (channel === "update-windows") {
				ipcRenderer.removeListener(channel, func);
			}
		},
	},
});
