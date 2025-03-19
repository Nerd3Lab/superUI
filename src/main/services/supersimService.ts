import { app, BrowserWindow, ipcMain } from 'electron';
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
import fs from 'fs';
import https from 'https';
import { execSync } from 'child_process';
import extract from 'extract-zip';
import path from 'path';
import { foundryBinaryPath } from './foundryService';
import { ParentService } from './parentService';
import { AppUpdater } from 'electron-updater';
import { TransactionService } from './transactionService';
import { typeChainID } from '../../shared/constant/chain';

const SUPERSIM_VERSION = '0.1.0-alpha.43'; // Update as needed
const DOWNLOAD_BASE_URL = `https://github.com/ethereum-optimism/supersim/releases/download/${SUPERSIM_VERSION}`;

let supersimProcess: ChildProcessWithoutNullStreams | null = null;
const supersimPath = path.join(app.getPath('userData'), 'supersim');
const binaryPath = path.join(
  supersimPath,
  process.platform === 'win32' ? 'supersim.exe' : 'supersim',
);

export type SupersimLog = {
  message: string;
  loading: boolean;
  running: boolean;
  error: boolean;
  chainLogsPath?: {
    [key in typeChainID]?: string;
  };
};

export type SupersimStartArgs = {
  mode?: 'quick' | 'fork';
  name?: string;
  l2?: string[];
};

// Determine the correct binary for the OS
function getDownloadUrl(): { url: string; filename: string } {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === 'win32') {
    return {
      url: `${DOWNLOAD_BASE_URL}/supersim_Windows_x86_64.zip`,
      filename: 'supersim_Windows_x86_64.zip',
    };
  } else if (platform === 'darwin') {
    return {
      url: `${DOWNLOAD_BASE_URL}/supersim_Darwin_x86_64.tar.gz`,
      filename: 'supersim_Darwin_x86_64.tar.gz',
    };
  } else if (platform === 'linux') {
    return {
      url: `${DOWNLOAD_BASE_URL}/supersim_Linux_x86_64.tar.gz`,
      filename: 'supersim_Linux_x86_64.tar.gz',
    };
  } else {
    throw new Error('Unsupported OS');
  }
}

async function downloadSupersim(window: BrowserWindow) {
  console.log('downloadSupersim');
  const { url, filename } = getDownloadUrl();
  const outputPath = path.join(supersimPath, filename);

  if (!fs.existsSync(supersimPath))
    fs.mkdirSync(supersimPath, { recursive: true });

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
            console.log('supersimPath', supersimPath);
            if (filename.endsWith('.zip')) {
              await extract(outputPath, { dir: supersimPath });
            } else {
              execSync(`tar -xzf "${outputPath}" -C "${supersimPath}"`);
            }

            window.webContents.send('supersim-log', {
              message: 'Supersim downloaded and ready!',
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

async function checkSupersim() {
  return new Promise((resolve) => {
    const quotedPath = `"${binaryPath}"`;
    exec([quotedPath, '--version'].join(' '), (error, stdout, stderr) => {
      console.log('supersim --version', stdout);
      console.log('supersim --version', stderr);
      if (error) {
        resolve({
          isSuccess: false,
          error: error.message,
          msg: undefined,
        });
      } else {
        resolve({
          isSuccess: true,
          error: undefined,
          msg: stdout,
        });
      }
    });
  });
}

async function checkFoundry() {
  return new Promise((resolve) => {
    exec('forge --version', (error, stdout, stderr) => {
      console.log('stdout', stdout);
      console.log('stderr', stderr);
      console.log('error', error);
      if (error) {
        resolve({
          isSuccess: false,
          error: error.message,
          msg: undefined,
        });
      } else {
        resolve({
          isSuccess: true,
          error: undefined,
          msg: stdout,
        });
      }
    });
  });
}

export class SupersimService extends ParentService {
  private transactionService: TransactionService;

  constructor(
    window: BrowserWindow,
    appUpdater: AppUpdater,
    transactionServiceIn: TransactionService,
  ) {
    super(window, appUpdater);
    this.registerEvents();
    this.transactionService = transactionServiceIn;
  }

  registerEvents() {
    ipcMain.handle('start-supersim', async (_, payload: SupersimStartArgs) => {
      const res = (await checkFoundry()) as any;

      if (this.isActive()) {
        this.window?.webContents?.send('supersim-log', {
          message: res.msg,
          loading: false,
          running: false,
          error: res.error ? true : false,
        });
      }

      if (supersimProcess) {
        if (this.isActive()) {
          this.window?.webContents?.send('supersim-log', {
            message: 'Supersim is already running',
            loading: false,
            running: true,
            error: false,
          });
        }
        return;
      }

      try {
        await downloadSupersim(this.window as BrowserWindow);
        await checkSupersim();

        console.log('payload', payload);

        // // Make executable (for Mac/Linux)
        if (process.platform !== 'win32') {
          // execSync(`chmod +x "${binaryPath}"`);
          fs.chmodSync(`${binaryPath}`, '755');
          if (this.isActive()) {
            this.window?.webContents?.send('supersim-log', {
              message: `Supersim binary made executable "${binaryPath}"`,
              loading: false,
              running: false,
              error: false,
            });
          }
        }

        let args: any[] = [];
        if (payload.mode === 'fork') {
          // --chains=op,base,zora --interop.enabled
          const chainArgs = payload.l2
            ? `--chains=${payload.l2.join(',')}`
            : '';
          args = ['fork', chainArgs, '--interop.enabled'];
        }

        const env = {
          ...process.env,
          PATH: `${foundryBinaryPath.dir}:${process.env.PATH || ''}`,
        };
        supersimProcess = spawn(binaryPath, args, { env, shell: false });
        supersimProcess.stdout.on('data', (data) => {
          const dataString = data.toString();

          if (dataString.includes('Available')) {
            const chainLogsPath: any = {};
            const regex =
              /ChainID:\s*(\d+)\s+RPC:\s*[^ ]+\s+LogPath:\s*([^\s]+)/g;

            let match;
            while ((match = regex.exec(dataString)) !== null) {
              const chainID = match[1]; // Extracted ChainID
              let logPath = match[2]; // Extracted LogPath
              if (logPath) {
                logPath = logPath.replace(/\n\nL2:/g, '').replace(/\n/g, '');
                logPath = logPath.replace(/\\n\\nL2:/g, '').replace(/\\n/g, '');
                chainLogsPath[chainID] = logPath;
              }
            }

            if (this.isActive()) {
              this.window?.webContents?.send('supersim-log', {
                message: dataString,
                loading: false,
                running: true,
                error: false,
                chainLogsPath,
              });
            }
          } else {
            if (this.isActive()) {
              this.window?.webContents?.send('supersim-log', {
                message: `INFO ${dataString}`,
                loading: false,
                running: false,
                error: false,
              });
            }
          }
        });

        supersimProcess.stderr.on('data', (data) => {
          if (this.isActive()) {
            this.window?.webContents?.send('supersim-log', {
              message: `ERROR: ${data.toString()}`,
              loading: false,
              running: false,
              error: true,
            });
          }
        });

        supersimProcess.on('exit', (code) => {
          if (this.isActive()) {
            this.window?.webContents?.send('supersim-log', {
              message: `Supersim exited with code ${code}`,
              loading: false,
              running: false,
              error: true,
            });
          }
          supersimProcess = null;
        });

        if (this.isActive()) {
          this.window?.webContents?.send('supersim-log', {
            message: 'Supersim started',
            loading: true,
            running: false,
            error: false,
          });
        }
      } catch (error) {
        if (this.isActive()) {
          this.window?.webContents?.send('supersim-log', {
            message: `ERROR: ${error}`,
            loading: false,
            running: false,
            error: true,
          });
        }
      }
    });

    ipcMain.handle('stop-supersim', async (event) => {
      if (supersimProcess) {
        supersimProcess.kill();
        supersimProcess = null;
        console.log('stop-supersim: Supersim stopped');
        if (this.isActive()) {
          this.window?.webContents?.send('supersim-log', {
            message: 'Supersim stopped',
            loading: false,
            running: false,
            error: false,
          });
        }
      } else {
        console.log('stop-supersim: Supersim is not running');
        if (this.isActive()) {
          this.window?.webContents?.send('supersim-log', {
            message: 'Supersim is not running',
            loading: false,
            running: false,
            error: false,
          });
        }
      }
    });

    ipcMain.handle('supersim-status', async (event) => {
      return supersimProcess ? true : false;
    });

    app.on('before-quit', () => {
      if (supersimProcess) {
        supersimProcess.kill();
        supersimProcess = null;
      }
    });
  }
}
