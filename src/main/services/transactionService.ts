import { BrowserWindow, ipcMain } from 'electron';
import { AppUpdater } from 'electron-updater';
import { ParentService } from './parentService';
import {
  getPublicClient,
  getPublicClientType,
} from '../../shared/utils/client';
import { createPublicClient, Log, TransactionReceipt, webSocket } from 'viem';
import { ChainConfigType } from '../../renderer/states/chain/reducer';

export interface subscribeToChainInterface {
  chain: ChainConfigType;
}

export type LoggingType = {
  address: `0x${string}`;
  topics: string[];
  data: `0x${string}`;
}


export type TransactionType = {
  hash: `0x${string}`;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  type: 'Transfer' | 'ContractCall' | 'ContractCreated' | 'Unknown';
  logs?: LoggingType[];
};

export interface TransactionChainInterface {
  txHash: `0x${string}`;
  chain: ChainConfigType;
  transaction: TransactionType;
}

export class TransactionService extends ParentService {
  constructor(window: BrowserWindow, appUpdater: AppUpdater) {
    super(window, appUpdater);
    this.registerEvents();
  }

  registerEvents() {
    ipcMain.handle(
      'subscribe',
      async (_, payload: subscribeToChainInterface) => {
        console.log('Subscribing to chain:', payload);
        const { chain } = payload;
        // Subscribe to chain
        const client = getPublicClient(chain);

        client.watchPendingTransactions({
          onTransactions: async (transactions) => {
            console.log('New transactions:', transactions);
            for (const tx of transactions) {
              const processedTx = await this.processTransaction(client, tx);
              if (processedTx) {
                this.window?.webContents?.send('transaction', {
                  txHash: tx,
                  chain: chain,
                  transaction: processedTx,
                });
              }
            }
          },
        });
      },
    );
  }

  async processTransaction(client: getPublicClientType, txHash: `0x${string}`) {
    try {
      const tx = await client.getTransaction({
        hash: txHash,
      });
      if (!tx) return null;

      let type = 'Unknown';
      if (!tx.to) type = 'ContractCreated';
      else if (tx.input === '0x') type = 'Transfer';
      else type = 'ContractCall';

      const receipt = await client.getTransactionReceipt({ hash: txHash });

      const logsTransform = receipt?.logs.map((log) => {
        const topics = log.topics.map((topic) => {
          return topic.toString();
        });

        return {
          address: log.address,
          topics,
          data: log.data,
        };
      });

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || 'ContractCreation',
        value: tx.value.toString(),
        gasUsed: receipt?.gasUsed.toString(),
        type,
        logs: logsTransform,
      };
    } catch (error) {
      console.error('Error processing transaction:', error);
      return null;
    }
  }
}
