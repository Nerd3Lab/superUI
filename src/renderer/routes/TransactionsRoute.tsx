import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TransactionCard } from '../components/project/TransactionCard';
import SearchBox from '../components/utility/SearchBox';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import { useState } from 'react';
import { useTransactionsState } from '../states/transaction/reducer';

interface Props extends SimpleComponent {}

const TransactionsRouteWrapper = styled.div``;

function DashboardTransactionsRoute(props: Props) {
  const navigate = useNavigate();
  const { chainId } = useCurrentChainParams();
  const [select, setSelect] = useState<
    'all' | 'Transfer' | 'ContractCall' | 'ContractCreated' | 'Unknown'
  >('all');

  const transactions = useTransactionsState().items;
  const transactionsChain = transactions[chainId] || [];

  const transactionsChainFiltered = transactionsChain.filter((transaction) => {
    if (select === 'all') {
      return true;
    }
    return transaction.type === select;
  });

  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  console.log('transactionsChainFiltered', transactionsChainFiltered);

  const handleSelect = (
    type: 'all' | 'Transfer' | 'ContractCall' | 'ContractCreated' | 'Unknown',
  ) => {
    setSelect(type);
  };

  return (
    <TransactionsRouteWrapper className="flex flex-col h-full">
      <div className="h-[3rem] mb-5 flex justify-between items-center">
        <div className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm my-3">
          <button
            onClick={() => handleSelect('all')}
            className={`px-4 py-2 text-sm font-semibold text-gray-700 rounded-l-lg cursor-pointer ${select === 'all' ? 'bg-gray-200' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => handleSelect('Transfer')}
            className={`px-4 py-2 text-sm font-semibold text-gray-700 border-l border-gray-300 cursor-pointer ${select === 'Transfer' ? 'bg-gray-200' : ''}`}
          >
            VALUE TRANSFER
          </button>

          <button
            onClick={() => handleSelect('ContractCall')}
            className={`px-4 py-2 text-sm font-semibold text-gray-700 border-l border-gray-300 cursor-pointer ${select === 'ContractCall' ? 'bg-gray-200' : ''}`}
          >
            Contract Call
          </button>
          <button
            onClick={() => handleSelect('ContractCreated')}
            className={`px-4 py-2 text-sm font-semibold text-gray-700 rounded-r-lg border-l border-gray-300 cursor-pointer ${select === 'ContractCreated' ? 'bg-gray-200' : ''}`}
          >
            Contract Created
          </button>
        </div>
        <div>
          <SearchBox onChange={handleSearch} value={search} />
        </div>
      </div>
      <div className="space-y-6 overflow-y-auto h-full">
        {transactionsChainFiltered.map((transaction, index) => {
          return <TransactionCard key={transaction.hash} data={transaction} />;
        })}
      </div>
    </TransactionsRouteWrapper>
  );
}

export default DashboardTransactionsRoute;
