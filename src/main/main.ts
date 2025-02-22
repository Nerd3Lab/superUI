/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { installExtension, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import fs from 'fs';
import os from 'node:os';
import { IpcHandler } from './services/ipcHandler';

const electronLogsPath = log.transports.file.getFile().path;

class AppUpdater {
  private downloadProgressDialog: Electron.MessageBoxReturnValue | null = null;

  private showDownloadProgressDialog() {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Downloading Updates',
        message: 'Downloading updates...',
        buttons: [],
      })
      .then((dialogRef) => {
        this.downloadProgressDialog = dialogRef;
      });
  }

  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available', () => {
      console.log('update-available');
      dialog
        .showMessageBox({
          type: 'info',
          title: 'Found Updates',
          message: 'Found updates, do you want to update now?',
          buttons: ['Update', 'No'],
        })
        .then((buttonIndex) => {
          if (buttonIndex.response === 0) {
            this.showDownloadProgressDialog();
            autoUpdater.downloadUpdate();
          }
        });
    });

    // autoUpdater.on('download-progress', (progressObj) => {
    //   if (this.downloadProgressDialog) {
    //     const log_message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
    //     dialog.showMessageBox({
    //       type: 'info',
    //       title: 'Downloading Updates',
    //       message: log_message,
    //       buttons: [],
    //     });
    //   }
    // });

    autoUpdater.on('update-downloaded', () => {
      if (this.downloadProgressDialog) {
        this.downloadProgressDialog = null;
      }
      dialog
        .showMessageBox({
          type: 'info',
          title: 'Install Updates',
          message: 'Updates downloaded, application will be quit for update...',
          buttons: ['Quit and Install'],
        })
        .then(() => {
          autoUpdater.quitAndInstall(false, true);
        });
    });
  }
}

let mainWindow: BrowserWindow | null = null;

// test
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('log' + electronLogsPath));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

// ctl shift p to open pestiside
const installREDUX = async () => {
  return installExtension([REDUX_DEVTOOLS])
    .then(([redux, react]: any[]) =>
      console.log(`Added Extensions:  ${redux.name}, ${react.name}`),
    )
    .catch((err: any) => console.log('An error occurred: ', err));
};

const createWindow = async () => {
  if (isDebug) {
    await installREDUX();
  }

  // mainWindow?.webContents.openDevTools();

  // console.log(session.defaultSession.getAllExtensions());

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    // width: 1440,
    // height: 960,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      // nodeIntegration: true,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    // mainWindow.webContents.openDevTools();
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.minimize();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  // Initialize IPC Handler
  new IpcHandler(mainWindow, autoUpdater);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
