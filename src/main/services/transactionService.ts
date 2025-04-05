import { BrowserWindow, dialog, ipcMain } from 'electron';
import { AppUpdater } from 'electron-updater';
import { ParentService } from './parentService';
import {
  getPublicClient,
  getPublicClientType,
} from '../../shared/utils/client';
import { createPublicClient, Log, TransactionReceipt, webSocket } from 'viem';
import { ChainConfigType } from '../../renderer/states/chain/reducer';
import fs from 'fs';

export interface subscribeToChainInterface {
  chain: ChainConfigType;
}

export type LoggingType = {
  address: `0x${string}`;
  topics: string[];
  data: `0x${string}`;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
  blockNumber: string;
  transactionHash: `0x${string}`;
  blockHash: `0x${string}`;
};

export type TransactionType = {
  hash: `0x${string}`;
  from: `0x${string}`;
  to?: `0x${string}` | null;
  value: string;
  gasUsed: string;
  type: 'Transfer' | 'ContractCall' | 'ContractCreated' | 'Unknown';
  logs?: LoggingType[];
  contractAddress?: string | null;
  blockNumber: string;
  status: 'success' | 'reverted' | 'Failed';
  timeStamp: number;
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
        // console.log('Subscribing to chain:', payload);
        const { chain } = payload;
        // Subscribe to chain
        const client = getPublicClient(chain);

        client.watchPendingTransactions({
          onTransactions: async (transactions) => {
            // console.log('New transactions:', transactions);
            for (const tx of transactions) {
              const processedTx = await this.processTransaction(client, tx);
              if (processedTx) {
                if (this.isActive()) {
                  this.window?.webContents?.send('transaction', {
                    txHash: tx,
                    chain: chain,
                    transaction: processedTx,
                  });
                }
              }
            }
          },
        });
      },
    );
  }

  async processTransaction(
    client: getPublicClientType,
    txHash: `0x${string}`,
  ): Promise<TransactionType | null> {
    try {
      const tx = await client.getTransaction({ hash: txHash });
      if (!tx) return null;

      const receipt = await client.getTransactionReceipt({ hash: txHash });

      let type : any = 'Unknown';
      let contractAddress: string | null = null;

      if (!tx.to) {
        type = 'ContractCreated';
        contractAddress = receipt?.contractAddress || null;
      } else if (tx.input === '0x') {
        type = 'Transfer';
      } else {
        type = 'ContractCall';
      }

      console.log('receipt', receipt);

      const logsTransform: LoggingType[] = receipt?.logs.map((log) => {
        const topics = log.topics.map((topic) => {
          return topic.toString();
        });

        return {
          address: log.address,
          topics,
          data: log.data,
          transactionIndex: log.transactionIndex,
          logIndex: log.logIndex,
          removed: log.removed,
          blockNumber: log.blockNumber.toString(),
          transactionHash: log.transactionHash,
          blockHash: log.blockHash,
        };
      });

      const timeStamp = new Date().getTime();

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value.toString(),
        gasUsed: receipt?.gasUsed.toString(),
        type,
        logs: logsTransform,
        contractAddress,
        blockNumber: receipt?.blockNumber.toString(),
        status: receipt?.status ? receipt?.status : 'Failed',
        timeStamp,
      };
    } catch (error) {
      console.error('Error processing transaction:', error);
      return null;
    }
  }
}
