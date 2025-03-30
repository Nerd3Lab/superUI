import { Icon } from '@iconify/react';
import { useState } from 'react';
import styled from 'styled-components';
import ButtonStyled from '../components/utility/ButtonStyled';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import CopyText from '../components/utility/CopyText';
import { useContractState } from '../states/contract/reducer';
import { useFetchBalance } from '../hooks/useFetchBalance';
import { Address } from 'viem';
import { useTransactionsState } from '../states/transaction/reducer';
import { TransactionCard } from '../components/project/TransactionCard';

interface Props extends SimpleComponent {}

const DashboardContractDetailRouteWrapper = styled.div``;

function Tab({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`w-1/3 text-center font-semibold pb-2 cursor-pointer ${isActive ? 'text-brand-700 border-b-2 border-brand-600' : 'text-gray-500'}`}
      onClick={onClick}
    >
      <div className="flex justify-center items-center gap-2">
        <div>{label}</div>
        {count !== undefined && (
          <div className="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-xs">
            {count}
          </div>
        )}
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-8">
    <div className="w-1/4 text-gray-700 text-sm">{label}</div>
    <div className="w-2/4 text-gray-600 break-words">{value}</div>
  </div>
);

function DashboardContractDetailRoute(props: Props) {
  const [selectedTab, setSelectedTab] = useState('transaction');
  const { layer, chainId } = useCurrentChainParams();
  const { contractAddress } = useParams();
  const navigate = useNavigate();

  const contractState = useContractState();
  const contract = contractState.items[chainId]?.find(
    (c) => c.contractAddress === contractAddress,
  );

  if (!contract) {
    navigate(`/dashboard/contracts/${layer}/${chainId}`);
    return <></>;
  }

  const abi = contract.abi;
  const balance = useFetchBalance(contractAddress as Address);

  const transactions = useTransactionsState().items;
  const transactionsChain = transactions[chainId] || [];
  const transactionsContract = transactionsChain.filter(
    (t) =>
      t.to === contractAddress ||
      t.from === contractAddress ||
      t.contractAddress === contractAddress,
  );

  return (
    <DashboardContractDetailRouteWrapper className="px-3 py-2">
      {/* Header */}
      <Link
        to={`/dashboard/contracts/${layer}/${chainId}`}
        className="flex gap-1.5 items-center text-brand-700 mb-5 cursor-pointer"
      >
        <Icon icon="gravity-ui:arrow-left" />
        <div className="text-sm font-semibold">Go back</div>
      </Link>
      {/* Address Section */}
      <div className="flex flex-col mb-4">
        <div className="flex gap-1 items-center">
          <div className="text-lg font-semibold text-gray-900">
            Contract Address : {contractAddress}
          </div>
          <CopyText value={contractAddress || ''} />
        </div>
        <div className="flex gap-1 items-center">
          <div className="text-lg font-semibold text-gray-900">
            Contract Name : {contract.name || '-'}{' '}
            {contract.contractName ? `(${contract.contractName})` : ''}
          </div>
          {abi && (
            <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs">
              <Icon icon={'lets-icons:check-fill'} className="text-xl" />
              ABI
            </div>
          )}
        </div>

        <div className="flex gap-1 items-center">
          <div className="text-lg font-semibold text-gray-900">
            ETH balance : {balance?.formatEth} ETH
          </div>
        </div>
      </div>
      {/* Information Section */}
      {/* <div className="flex shadow-sm bg-white p-5 rounded-2xl border border-gray-200 my-3"></div> */}
      {/* Tabs Section */}
      <div className="w-full flex mb-5">
        {/* <Tab
          label="STORAGE"
          isActive={selectedTab === 'storage'}
          onClick={() => setSelectedTab('storage')}
        /> */}
        <Tab
          label="TRANSACTIONS"
          count={transactionsContract.length}
          isActive={selectedTab === 'transaction'}
          onClick={() => setSelectedTab('transaction')}
        />
        {/* <Tab
          label="EVENTS"
          isActive={selectedTab === 'events'}
          onClick={() => setSelectedTab('events')}
        /> */}
      </div>
      {selectedTab === 'transaction' && (
        <div className="flex flex-col gap-4">
          {transactionsContract.map((t) => (
            <TransactionCard key={t.hash} data={t} />
          ))}
        </div>
      )}
    </DashboardContractDetailRouteWrapper>
  );
}

export default DashboardContractDetailRoute;
