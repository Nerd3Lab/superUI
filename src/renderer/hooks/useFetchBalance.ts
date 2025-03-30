import { useEffect, useState } from 'react';
import { getPublicClient } from '../../shared/utils/client';
import { useChainState } from '../states/chain/reducer';
import { useCurrentChainParams } from './useCurrentChainParams';
import { Address } from 'viem';
import { formatBalanceWei } from '../utils/index';
import { useRefreshState } from '../states/refresh/reducer';

export const useFetchBalance = (address?: Address) => {
  const { chainId, layer } = useCurrentChainParams();
  const chainState = useChainState();

  const chain = chainState.chainConfing[chainId];
  const publicClient = chain ? getPublicClient(chain) : undefined;
  const refresh = useRefreshState();
  const [result, setResult] = useState<{
    value: BigInt;
    formatEth: string;
  }>({
    value: 0n,
    formatEth: '0',
  });

  const setBalance = async () => {
    if (!publicClient) return;
    if (!address) return;
    try {
      const balance = await publicClient.getBalance({
        address,
      });

      setResult({
        value: balance,
        formatEth: formatBalanceWei(balance.toString()),
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (!chain || !address) {
      setResult({
        value: 0n,
        formatEth: '0',
      });
    } else {
      setBalance();
    }
  }, [chain, address, refresh]);

  return result;
};
