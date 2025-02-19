import { http, createPublicClient, Address, createWalletClient } from 'viem';

export const getPublicClient = (chain: any) =>
  createPublicClient({
    chain,
    transport: http(),
  });

export const getWalletClient = (chain: any, privateKey: Address) => {
  return createWalletClient({
    chain,
    transport: http(),
    account: privateKey,
  });
};
