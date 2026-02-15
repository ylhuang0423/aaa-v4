import type { ElectronAPI } from '@electron-toolkit/preload';
import type { PhotoLibrary } from '../shared/types';

export interface PhotoApi {
  selectDirectory(): Promise<string | null>;
  scanDirectory(rootPath: string): Promise<PhotoLibrary>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: PhotoApi;
  }
}
