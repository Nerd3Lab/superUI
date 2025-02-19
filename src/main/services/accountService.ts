import { BrowserWindow, ipcMain } from 'electron';
import { AccountList } from '../../shared/constant/account';
import { getPublicClient, getWalletClient } from '../../shared/utils/client';
import { ParentService } from './parentService';
import { AppUpdater } from 'electron-updater';
import { Address, parseEther } from 'viem';

export interface getAccountsInterface {
  privateKey: Address;
  publicKey: Address;
  balance: string;
  index: number;
}

export interface sendTransactionInterface {
  from: Address;
  to: Address;
  value: string;
  chain: any;
  privateKey: Address;
}

export type getAccountsResponse = getAccountsInterface[];

export class AccountService extends ParentService {
  constructor(window: BrowserWindow, appUpdater: AppUpdater) {
    super(window, appUpdater);
    this.registerEvents();
  }

  registerEvents() {
    ipcMain.handle('get-accounts', async (_, chain: any) => {
      try {
        const client = getPublicClient(chain);
        const balances = await Promise.all(
          AccountList.map(async (account, index) => {
            const balance = await client.getBalance({
              address: account.publicKey,
            });

            return {
              privateKey: account.privateKey,
              publicKey: account.publicKey,
              balance: balance.toString(), // You might want to convert it using ethers.utils.formatEther(balance)
              index,
            };
          }),
        );

        return balances;
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    });

    ipcMain.handle(
      'send-transaction',
      async (_, payload: sendTransactionInterface) => {
        const { from, to, value, privateKey } = payload;
        try {
          const publicClient = getPublicClient(payload.chain);
          const client = getWalletClient(payload.chain, privateKey);
          const tx = await client.sendTransaction({
            account: from,
            to,
            value: parseEther(value),
            chain: undefined,
          });

          // wait transaction success
          const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
          });

          return {
            isSuccess: true,
            receipt,
            error: undefined,
          };
        } catch (error: any) {
          console.error('Error sending transaction:', error);

          return {
            isSuccess: false,
            receipt: undefined,
            error: error,
          };
        }
      },
    );
  }
}
