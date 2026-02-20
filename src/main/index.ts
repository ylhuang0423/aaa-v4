import { app, shell, BrowserWindow, ipcMain, dialog, net, protocol } from 'electron';
import { copyFile, readdir, readFile, writeFile } from 'fs/promises';
import { basename, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

const PHOTO_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif']);

interface WindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized: boolean;
}

const DEFAULT_STATE: WindowState = { width: 900, height: 670, isMaximized: false };

function windowStatePath(): string {
  return join(app.getPath('userData'), 'window-state.json');
}

async function loadWindowState(): Promise<WindowState> {
  try {
    const data = await readFile(windowStatePath(), 'utf-8');
    return { ...DEFAULT_STATE, ...JSON.parse(data) };
  } catch {
    return DEFAULT_STATE;
  }
}

async function saveWindowState(win: BrowserWindow): Promise<void> {
  const bounds = win.getNormalBounds();
  const state: WindowState = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    isMaximized: win.isMaximized(),
  };
  await writeFile(windowStatePath(), JSON.stringify(state));
}

function createWindow(state: WindowState): void {
  const mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    ...(state.x != null && state.y != null ? { x: state.x, y: state.y } : {}),
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
    },
  });

  if (state.isMaximized) {
    mainWindow.maximize();
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', () => {
    saveWindowState(mainWindow);
  });

  mainWindow.webContents.on('context-menu', async (_event, params) => {
    if (params.mediaType !== 'image') return;
    if (!params.srcURL.startsWith('local-file://')) return;

    const filePath = decodeURIComponent(params.srcURL.slice('local-file://'.length));
    const fileName = basename(filePath);
    const { canceled, filePath: savePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: join(app.getPath('desktop'), fileName),
    });
    if (!canceled && savePath) {
      await copyFile(filePath, savePath);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle('dialog:selectDirectory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('fs:scanDirectory', async (_event, rootPath: string) => {
    const shelfDirs = await readdir(rootPath, { withFileTypes: true });
    const shelves = await Promise.all(
      shelfDirs
        .filter(entry => entry.isDirectory())
        .map(async shelfEntry => {
          const shelfPath = join(rootPath, shelfEntry.name);
          const albumDirs = await readdir(shelfPath, { withFileTypes: true });
          const albums = await Promise.all(
            albumDirs
              .filter(entry => entry.isDirectory())
              .map(async albumEntry => {
                const albumPath = join(shelfPath, albumEntry.name);
                const files = await readdir(albumPath, { withFileTypes: true });
                const photos = files
                  .filter(file => {
                    if (!file.isFile()) return false;
                    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
                    return PHOTO_EXTENSIONS.has(ext);
                  })
                  .map(file => ({
                    name: file.name,
                    url: 'local-file://' + encodeURIComponent(join(albumPath, file.name)),
                  }));
                return { name: albumEntry.name, photos };
              }),
          );
          return { name: shelfEntry.name, albums };
        }),
    );
    return shelves;
  });
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'local-file', privileges: { bypassCSP: true, stream: true } },
]);

app.whenReady().then(() => {
  protocol.handle('local-file', (request) => {
    const filePath = decodeURIComponent(request.url.slice('local-file://'.length));
    return net.fetch(pathToFileURL(filePath).href);
  });
  electronApp.setAppUserModelId('com.ylhuang.aaa-v4');
  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(icon);
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  registerIpcHandlers();
  loadWindowState().then(state => {
    createWindow(state);

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow(state);
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
