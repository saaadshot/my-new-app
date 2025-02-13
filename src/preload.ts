// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

declare global {
	interface Window {
		electron: {
			openNewWindow: () => void;
		};
	}
}

contextBridge.exposeInMainWorld("electron", {
	openNewWindow: () => ipcRenderer.send("open-new-window"),
});
