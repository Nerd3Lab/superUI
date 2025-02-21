import { Icon } from '@iconify/react';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { StatusBadge } from '../utility/StatusBadge';
import { formatBalanceWei, SplitAddress } from '../../utils/index';

const TransactionCardWrapper = styled.div``;

interface TransactionCardProps {
  tx: string;
  status: 'Transfer' | 'ContractCall' | 'ContractCreated' | 'Unknown';
  fromAddress: string;
  toAddress: string;
  gasUsed: string;
  value: string;
  key: string;
}
export const TransactionCard = (props: TransactionCardProps) => {
  const {
    tx,
    fromAddress,
    gasUsed,
    status = 'Transfer',
    toAddress,
    value,
    key,
  } = props;
  return (
    <TransactionCardWrapper
      key={key}
      className="rounded-xl p-5 border border-gray-200"
    >
      <div className="flex w-full justify-between mb-3">
        <div>
          <div className="text-gray-600">TX HASH</div>
          <div className="text-gray-700 text-sm font-semibold">{tx}</div>
        </div>
        <div>
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="flex">
        <TransactionCardItem
          title="FROM ADDRESS"
          value={SplitAddress(fromAddress)}
        />
        {toAddress && (
          <TransactionCardItem
            title="TO ADDRESS"
            value={toAddress ? SplitAddress(toAddress) : ''}
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
}
const TransactionCardItem = ({ title, value }: TransactionCardItemProps) => {
  return (
    <div className="w-1/4">
      <div className="text-gray-600">{title}</div>
      <div className="text-gray-700 mt-0.5 font-semibold text-sm truncate">
        {value}
      </div>
    </div>
  );
};
