// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  getAccountsResponse,
  sendTransactionInterface,
} from './services/accountService';
import { SupersimStartArgs } from './services/supersimService';
import { TransactionReceipt } from 'viem';
import { subscribeToChainInterface } from './services/transactionService';
import { subscribeToLogInterface } from './services/loggingService';

export type Channels =
  | 'ipc-example'
  | 'send-message'
  | 'supersim-log'
  | 'anvil-log'
  | 'update-downloaded'
  | 'transaction'
  | 'log-update'
  | 'download-progress'
  | 'update-downloaded-success';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    // send: (channel: Channels, ...args: unknown[]) =>
    //   ipcRenderer.send(channel, ...args),
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        console.log('Removing listener', channel);
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    off(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.removeListener(channel, func);
    },
  },
  accounts: {
    getAccounts: (chain: any) =>
      ipcRenderer.invoke('get-accounts', chain) as Promise<getAccountsResponse>,
    // updateAccount: (id: string, name: string) => ipcRenderer.invoke('update-account', id, name),
    sendTransaction: (payload: sendTransactionInterface) =>
      ipcRenderer.invoke('send-transaction', payload) as Promise<{
        isSuccess: boolean;
        receipt: TransactionReceipt;
        error: any;
      }>,
  },
  foudry: {
    check: () =>
      ipcRenderer.invoke('check-foundry') as Promise<{
        isSuccess: boolean;
        error: string;
        msg: string;
        stderr: string;
      }>,
  },
  supersim: {
    startSupersim: (payload: SupersimStartArgs) =>
      ipcRenderer.invoke('start-supersim', payload) as Promise<void>,
    stopSupersim: () => ipcRenderer.invoke('stop-supersim') as Promise<void>,
    supersimStatus: () =>
      ipcRenderer.invoke('supersim-status') as Promise<boolean>,
  },
  app: {
    checkUpdate: () => ipcRenderer.invoke('check-update') as Promise<void>,
    getCurrentVersion: () =>
      ipcRenderer.invoke('get-current-version') as Promise<any>,
    startUpdate: () => ipcRenderer.invoke('start-update') as Promise<void>,
    updateDownloaded: () =>
      ipcRenderer.invoke('update-downloaded') as Promise<void>,
  },
  transaction: {
    subscribe: (chain: subscribeToChainInterface) =>
      ipcRenderer.invoke('subscribe', chain) as Promise<void>,
  },
  log: {
    subscribe: (chain: subscribeToLogInterface) =>
      ipcRenderer.invoke('subscribe-log', chain) as Promise<boolean>,
    unsubscribe: () =>
      ipcRenderer.invoke('unsubscribe-log') as Promise<boolean>,
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

(window as any).togglePesticide = () => {
  const existingStyle = document.getElementById('pesticide-style');
  if (existingStyle) {
    existingStyle.remove();
  } else {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/mrmrs/pesticide/pesticide.css';
    style.id = 'pesticide-style';
    document.head.appendChild(style);
  }
};
