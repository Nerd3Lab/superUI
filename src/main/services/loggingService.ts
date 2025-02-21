import { BrowserWindow, ipcMain } from 'electron';
import { AppUpdater } from 'electron-updater';
import { ParentService } from './parentService';
import { ChainConfigType } from '../../renderer/states/chain/reducer';
import fs from 'fs';

export interface subscribeToLogInterface {
  chain: ChainConfigType;
  file: string;
}

export class LoggingService extends ParentService {
  private watcher: fs.FSWatcher | null = null;

  constructor(window: BrowserWindow, appUpdater: AppUpdater) {
    super(window, appUpdater);
    this.registerEvents();
  }

  registerEvents() {
    ipcMain.handle('subscribe-log', (_, payload: subscribeToLogInterface) => {
      const logFilePath = payload.file;
      // check if file exists
      if (!fs.existsSync(logFilePath)) {
        return false;
      }
      let fileSize = fs.statSync(logFilePath).size;

      this.watcher = fs.watch(logFilePath, (eventType) => {
        if (eventType === 'change') {
          const newSize = fs.statSync(logFilePath).size;
          if (newSize > fileSize) {
            const stream = fs.createReadStream(logFilePath, {
              encoding: 'utf-8',
              start: fileSize,
              end: newSize,
            });

            stream.on('data', (chunk) => {
              console.log('chunk', chunk.toString().trim());
              this.window?.webContents?.send('log-update', {
                chain: payload.chain,
                msg: chunk.toString().trim(),
              });
            });

            fileSize = newSize;
          }
        }
      });

      return true;
    });

    ipcMain.handle('unsubscribe-log', () => {
      this.stopWatching();
      return true;
    });
  }

  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}
