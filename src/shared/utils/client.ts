import { http, createPublicClient, Address, createWalletClient } from 'viem';
import { ChainConfigType } from '../../renderer/states/chain/reducer';

export const getPublicClient = (chain: ChainConfigType) =>
  createPublicClient({
    chain,
    transport: http(),
  });

export const getWalletClient = (chain: ChainConfigType, privateKey: Address) => {
  return createWalletClient({
    chain,
    transport: http(),
    account: privateKey,
  });
};

export type getPublicClientType = ReturnType<typeof getPublicClient>;
export type getWalletClientType = ReturnType<typeof getWalletClient>;
