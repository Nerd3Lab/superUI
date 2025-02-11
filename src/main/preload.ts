// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { getAccountsResponse } from './services/accountService';
import { SupersimStartArgs } from './services/supersimService';

export type Channels = 'ipc-example' | 'send-message' | 'supersim-log' | 'anvil-log';

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
  },
  accounts: {
    getAccounts: (chain: any) =>
      ipcRenderer.invoke('get-accounts', chain) as Promise<getAccountsResponse>,
    // updateAccount: (id: string, name: string) => ipcRenderer.invoke('update-account', id, name),
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
