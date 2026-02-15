import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { PhotoApi } from './index.d';

const api: PhotoApi = {
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  scanDirectory: rootPath => ipcRenderer.invoke('fs:scanDirectory', rootPath),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
