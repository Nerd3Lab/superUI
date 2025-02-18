import { BrowserWindow, ipcMain } from 'electron';
import { AccountList } from '../../shared/constant/account';
import { getPublicClient } from '../../shared/utils/client';
import { ParentService } from './parentService';
import { AppUpdater } from 'electron-updater';

export interface getAccountsInterface {
  privateKey: string;
  publicKey: `0x${string}`;
  balance: string;
}

export type getAccountsResponse = getAccountsInterface[];

export class AccountService extends ParentService {
  constructor(
    window: BrowserWindow,
    appUpdater: AppUpdater,
  ) {
    super(window, appUpdater);
    this.registerEvents();
  }

  registerEvents() {
    ipcMain.handle('get-accounts', async (_, chain: any) => {
      try {
        const client = getPublicClient(chain);
        const balances = await Promise.all(
          AccountList.map(async (account) => {
            const balance = await client.getBalance({
              address: account.publicKey,
            });

            return {
              privateKey: account.privateKey,
              publicKey: account.publicKey,
              balance : balance.toString(), // You might want to convert it using ethers.utils.formatEther(balance)
            };
          }),
        );

        return balances;
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    });
  }
}
