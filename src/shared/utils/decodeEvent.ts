import { AbiItem } from '../../main/services/contractService';
import { LoggingType } from '../../main/services/transactionService';
import { ChainConfigType } from '../../renderer/states/chain/reducer';
import { getPublicClient } from './client';
import { decodeEventLog } from 'viem';

export type decodeEventType = {
  eventName: string;
  args: Record<string, any>;
};

export const decodeEvent = (
  event: LoggingType,
  abi: AbiItem[] | undefined,
): decodeEventType | undefined => {
  if (!abi || !event) {
    return undefined;
  }

  try {
    const decodedEvent = decodeEventLog({
      abi,
      data: event.data,
      topics: event.topics as any,
    }) as decodeEventType;

    return decodedEvent;
  } catch (error) {
    console.error('Error decoding event:', error);
    return undefined;
  }
};
