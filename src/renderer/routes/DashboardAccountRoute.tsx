import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Pagination from '../components/utility/Pagination';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import ChainIcon from '../components/utility/ChainIcon';
import { useChainState } from '../states/chain/reducer';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import { ipcMain } from 'electron';
import {
  getAccountsInterface,
  getAccountsResponse,
} from '../../main/services/accountService';
import { formatEther } from 'viem';
import CopyText from '../components/utility/CopyText';
import Modal from '../components/utility/Modal';
import { useDispatch } from 'react-redux';
import { openModal } from '../states/modal/reducer';
import AccountDetailModal from '../components/modal/AccountDetailModal';
import TransferModal from '../components/modal/TransferModal';
import { useAccountsState } from '../states/account/reducer';

interface Props extends SimpleComponent {}

const DashboardAccountRouteWrapper = styled.div``;

function DashboardAccountRoute(props: Props) {
  const dispatch = useDispatch();
  const [selectedAccount, setSelectedAccount] =
    useState<getAccountsInterface>();

  const { chainId } = useCurrentChainParams();
  const accountsState = useAccountsState();

  const accounts = accountsState[chainId] || [];

  const formatBalance = (balance: string) => {
    const balanceBigInt = BigInt(balance);
    return formatEther(balanceBigInt);
  };

  const openAccountKeyModal = (account: getAccountsInterface) => {
    setSelectedAccount(account);
    dispatch(openModal('accountKey'));
  };

  const openTransferModal = (account: getAccountsInterface) => {
    setSelectedAccount(account);
    dispatch(openModal('transfer'));
  };

  return (
    <DashboardAccountRouteWrapper className="p-4">
      <Modal modalId="accountKey">
        <AccountDetailModal account={selectedAccount} />
      </Modal>

      <Modal modalId="transfer">
        <TransferModal account={selectedAccount} />
      </Modal>

      <div className="shadow-sm bg-white p-5 rounded-2xl border-1 border-gray-200">
        <div className="flex justify-between text-gray-700 text-base">
          <p>MNEMONIC</p>
          <p>HD PATH</p>
        </div>
        <div className="flex justify-between text-gray-600 text-sm">
          <p className="flex items-center gap-2">
            sustain culture alert awake relax attitude acid local farm butter
            coffee glad
            <CopyText
              value="sustain culture alert awake relax attitude acid local farm butter
            coffee glad"
            />
          </p>
          <p>m44'60'0'0account_index</p>
        </div>
      </div>

      {/* table */}
      <div className="w-full text-sm">
        <table className="w-full mt-4">
          <thead>
            <tr className="border-b-1 border-gray-200">
              <th className="text-left py-3">Public key</th>
              <th className="text-left py-3">Balance</th>
              <th className="text-left py-3">TX COUNT</th>
              <th className="text-left py-3">INDEX</th>
              <th className="text-left py-3"></th>
            </tr>
          </thead>
          <tbody className="h-[20rem] overflow-scroll">
            {accounts.map((account, index) => (
              <tr className="border-b-1 border-gray-200" key={index}>
                <td className="text-left py-2 flex items-center gap-2">
                  <ChainIcon chain={'account'} />
                  <span className="w-[23rem]">{account.publicKey}</span>
                  <CopyText value={account.publicKey} />
                </td>
                <td className="text-left">{formatBalance(account.balance)}</td>
                <td className="text-left">0</td>
                <td className="text-left">{index}</td>
                <td className="text-left flex gap-2 items-center">
                  <div
                    className="flex items-center"
                    onClick={() => openAccountKeyModal(account)}
                  >
                    <Icon
                      icon="material-symbols:key"
                      className="cursor-pointer text-brand-300 text-2xl"
                    />
                  </div>

                  <div
                    className="flex items-center"
                    onClick={() => openTransferModal(account)}
                  >
                    <Icon
                      icon="ph:hand-deposit-fill"
                      className="cursor-pointer text-blue-500 text-2xl"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <Pagination
        totalPages={10}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      /> */}
    </DashboardAccountRouteWrapper>
  );
}

export default DashboardAccountRoute;
