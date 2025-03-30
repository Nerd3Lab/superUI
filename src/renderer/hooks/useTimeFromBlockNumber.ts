import { useEffect, useState } from 'react';
import { getPublicClient } from '../../shared/utils/client';
import { ChainConfigType, useChainState } from '../states/chain/reducer';
import { useCurrentChainParams } from './useCurrentChainParams';

export const useTimeFromBlockNumber = (
  chain?: ChainConfigType,
  blockNumber?: string,
) => {
  const publicClient = chain ? getPublicClient(chain) : undefined;
  const [result, setResult] = useState<{
    timestamp: bigint | undefined;
    format: string;
  }>({
    timestamp: undefined,
    format: '',
  });

  const setTime = async () => {
    if (!publicClient) return;
    if (!blockNumber) return;
    try {
      const time = await publicClient.getBlock({
        blockNumber: BigInt(blockNumber),
      });

      setResult({
        timestamp: time.timestamp,
        format: new Date(Number(time.timestamp) * 1000).toLocaleString(),
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (!chain || !blockNumber) {
      setResult({
        timestamp: undefined,
        format: '',
      });
    } else {
      setTime();
    }
  }, [chain, blockNumber]);

  return result;
};
