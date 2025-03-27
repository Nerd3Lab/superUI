import { Icon } from '@iconify/react';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { StatusBadge } from '../utility/StatusBadge';
import { formatBalanceWei, SplitAddress } from '../../utils/index';
import { TransactionType } from '../../../main/services/transactionService';
import CopyText from '../utility/CopyText';
import { useTimeFromBlockNumber } from '../../hooks/useTimeFromBlockNumber';

const TransactionCardWrapper = styled.div``;

interface TransactionCardProps {
  data: TransactionType;
}
export const TransactionCard = ({ data }: TransactionCardProps) => {
  const {
    hash,
    from,
    gasUsed,
    type = 'Transfer',
    to,
    value,
    status,
    contractAddress,
    blockNumber,
  } = data;

  const getTime = useTimeFromBlockNumber(blockNumber);

  return (
    <TransactionCardWrapper className="rounded-xl p-5 border border-gray-200">
      <div className="flex w-full justify-between mb-3">
        {/* <div>
          <div className="text-gray-600">TX HASH</div>
          <div className="text-gray-700 text-sm font-semibold">{hash}</div>
        </div> */}
        <TransactionCardItem title="TX HASH" value={hash} copy={hash} />
        <div className="flex flex-col gap-1">
          <StatusBadge status={status} />
          <StatusBadge status={type} />
        </div>
      </div>
      <div className="flex gap-2">
        <TransactionCardItem
          title="FROM ADDRESS"
          value={SplitAddress(from)}
          copy={from}
        />
        {to && type !== 'ContractCall' && (
          <TransactionCardItem
            title="TO ADDRESS"
            value={to ? SplitAddress(to) : ''}
            copy={to}
          />
        )}

        {to && type === 'ContractCall' && (
          <TransactionCardItem
            title="Contract"
            value={to ? SplitAddress(to) : ''}
            copy={to}
          />
        )}

        {contractAddress && (
          <TransactionCardItem
            title="Contract"
            value={contractAddress ? SplitAddress(contractAddress) : ''}
            copy={contractAddress}
          />
        )}

        <TransactionCardItem
          title="GAS USED"
          value={
            <div className="flex gap-3 items-center">
              <div>{gasUsed}</div>
              <div className="flex gap-0.5 items-center">
                {/* <Icon
                  icon="icon-park-outline:arrow-up"
                  className="text-sm text-error-500"
                /> */}
                {/* <div className="text-sm text-error-700">170%</div> */}
              </div>
            </div>
          }
        />

        <TransactionCardItem title="Time" value={<span className='text-xs'>{getTime.format}</span>} />
        <TransactionCardItem
          title="VALUE"
          value={`${formatBalanceWei(value, 0)} ETH`}
        />
      </div>
    </TransactionCardWrapper>
  );
};

interface TransactionCardItemProps {
  title: string;
  value: ReactNode;
  copy?: string;
}
const TransactionCardItem = ({
  title,
  value,
  copy = undefined,
}: TransactionCardItemProps) => {
  return (
    <div className="w-1/4">
      <div className="text-gray-600">{title}</div>
      <div className="text-gray-700 mt-0.5 font-semibold text-sm flex items-center gap-2">
        {value}
        {copy && <CopyText value={copy} size={'text-base'} />}
      </div>
    </div>
  );
};
