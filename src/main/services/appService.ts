import { BrowserWindow, ipcMain } from 'electron';
import { AppUpdater } from 'electron-updater';
import { ParentService } from './parentService';

export class AppService extends ParentService {
  constructor(window: BrowserWindow, appUpdater: AppUpdater) {
    super(window, appUpdater);
    this.registerEvents();
  }

  registerEvents() {
    ipcMain.handle('get-current-version', async () => {
      const currentVersion = this.appUpdater.currentVersion.version;
      const updateCheckResult = await this.appUpdater.checkForUpdates();
      const updateInfo = updateCheckResult
        ? updateCheckResult.updateInfo
        : null;
      return { currentVersion, updateInfo };
    });

    ipcMain.handle('start-update', async () => {
      this.appUpdater.downloadUpdate();
    });

    ipcMain.handle('update-downloaded', async () => {
      this.appUpdater.quitAndInstall();
    });

    this.appUpdater.on('update-downloaded', () => {
      if (this.isActive()) {
        this.window?.webContents.send('update-downloaded', true);
      }
    });
  }
}
