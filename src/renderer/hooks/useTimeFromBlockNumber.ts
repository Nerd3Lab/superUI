import { useEffect, useState } from 'react';
import { getPublicClient } from '../../shared/utils/client';
import { useChainState } from '../states/chain/reducer';
import { useCurrentChainParams } from './useCurrentChainParams';

export const useTimeFromBlockNumber = (blockNumber: string) => {
  const { chainId, layer } = useCurrentChainParams();
  const chainState = useChainState();

  const chain = chainState.chainConfing[chainId];
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
  }, [chain, blockNumber, setTime]);

  return result;
};
