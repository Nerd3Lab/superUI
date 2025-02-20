import { ipcMain, app, BrowserWindow } from 'electron';
import { exec, spawn } from 'child_process';
import * as fs from 'fs';
import * as https from 'https';
import { execSync } from 'child_process';
import extract from 'extract-zip';
import path from 'path';
import { ParentService } from './parentService';
import { AppUpdater } from 'electron-updater';

const FOUNDRY_VERSION = 'nightly-db3d9fc95398450dbed83d4841042c62c155bcfc';
const DOWNLOAD_BASE_URL = `https://github.com/foundry-rs/foundry/releases/download/${FOUNDRY_VERSION}`;
const foundryPath = path.join(app.getPath('userData'), 'foundry');
const isWin32 = process.platform === 'win32';
export const foundryBinaryPath = {
  anvil: path.join(foundryPath, isWin32 ? 'anvil.exe' : 'anvil'),
  cast: path.join(foundryPath, isWin32 ? 'cast.exe' : 'cast'),
  dir: foundryPath,
  chisel: path.join(foundryPath, isWin32 ? 'chisel.exe' : 'chisel'),
  forge: path.join(foundryPath, isWin32 ? 'forge.exe' : 'forge'),
};

export type anvilLog = {
  message: string;
  loading: boolean;
  running: boolean;
  error: boolean;
};

// Helper function to download a file via HTTPS
function getDownloadUrl(): { url: string; filename: string } {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === 'win32') {
    return {
      url: `${DOWNLOAD_BASE_URL}/foundry_nightly_win32_amd64.zip`,
      filename: 'foundry_nightly_win32_amd64.zip',
    };
  } else if (platform === 'darwin') {
    return {
      url: `${DOWNLOAD_BASE_URL}/foundry_nightly_darwin_arm64.tar.gz`,
      filename: 'foundry_nightly_darwin_arm64.tar.gz',
    };
  } else if (platform === 'linux') {
    return {
      url: `${DOWNLOAD_BASE_URL}/foundry_nightly_linux_amd64.tar.gz`,
      filename: 'foundry_nightly_linux_amd64.tar.gz',
    };
  } else {
    throw new Error('Unsupported OS');
  }
}

async function downloadAndSetupAnvil(window?: BrowserWindow) {
  const { url, filename } = getDownloadUrl();
  console.log('Downloading Anvil:', url);
  const outputPath = path.join(foundryPath, filename);

  if (!fs.existsSync(foundryPath))
    fs.mkdirSync(foundryPath, { recursive: true });

  return new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    function followRedirect(response: any) {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, followRedirect);
      } else if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
      } else {
        response.pipe(file);
        file.on('finish', async () => {
          file.close();
          console.log(`Downloaded: ${outputPath}`);

          // Extract and make it executable
          try {
            console.log('outputPath', outputPath);
            console.log('foundryPath', foundryPath);
            if (filename.endsWith('.zip')) {
              await extract(outputPath, { dir: foundryPath });
            } else {
              execSync(`tar -xzf "${outputPath}" -C "${foundryPath}"`);
            }

            // Make the binary executable
            if (process.platform !== 'win32') {
              // execSync(`chmod +x "${foundryBinaryPath.anvil}"`);
              // execSync(`chmod +x "${foundryBinaryPath.cast}"`);
              // execSync(`chmod +x "${foundryBinaryPath.chisel}"`);
              // execSync(`chmod +x "${foundryBinaryPath.forge}"`);
              fs.chmodSync(`${foundryBinaryPath.anvil}`, '755');
              fs.chmodSync(`${foundryBinaryPath.cast}`, '755');
              fs.chmodSync(`${foundryBinaryPath.chisel}`, '755');
              fs.chmodSync(`${foundryBinaryPath.forge}`, '755');
            }

            window?.webContents.send('anvil-log', {
              message: 'Anvil downloaded and ready!',
              loading: true,
              running: false,
              error: false,
            });
            resolve();
          } catch (error) {
            console.log('Error during extraction:', error);
            reject(error);
          }
        });
      }
    }

    https.get(url, followRedirect).on('error', (error) => {
      console.log('Download error:', error);
      reject(error);
    });
  });
}

const checkFoundry = async (): Promise<{
  isSuccess: boolean;
  error: string | undefined;
  msg: string | undefined;
}> => {
  return new Promise((resolve) => {
    spawn(`"${foundryBinaryPath.forge}"`, ['--version'], { shell: true }).on(
      'exit',
      (code) => {
        if (code === 0) {
          resolve({
            isSuccess: true,
            error: undefined,
            msg: 'Foundry is installed',
          });
        } else {
          resolve({
            isSuccess: false,
            error: 'Foundry is not installed',
            msg: undefined,
          });
        }
      },
    );
  });
};

export class FoundryService extends ParentService {
  constructor(window: BrowserWindow, appUpdater: AppUpdater) {
    super(window, appUpdater);
    this.registerEvents();
  }

  registerEvents() {
    ipcMain.handle('check-foundry', async () => {
      const check1 = await checkFoundry();
      if (check1.isSuccess) {
        if (this.isActive()) {
          this.window?.webContents.send('anvil-log', {
            message: check1.msg,
            loading: false,
            running: true,
            error: false,
          });
        }
        return;
      }

      try {
        await downloadAndSetupAnvil(this.window as BrowserWindow);
      } catch (error: any) {
        if (this.isActive()) {
          this.window?.webContents.send('anvil-log', {
            message: `Anvil download failed ${error.message}`,
            loading: false,
            running: false,
            error: true,
          });
        }
        return;
      }

      const check2 = await checkFoundry();

      if (check2.isSuccess) {
        if (this.isActive()) {
          this.window?.webContents.send('anvil-log', {
            message: check2.msg,
            loading: false,
            running: true,
            error: false,
          });
        }

        return;
      }

      if (this.isActive()) {
        this.window?.webContents.send('anvil-log', {
          message: 'Anvil is downloaded but Foundry is not installed',
          loading: false,
          running: false,
          error: true,
        });
      }
    });
  }
}
