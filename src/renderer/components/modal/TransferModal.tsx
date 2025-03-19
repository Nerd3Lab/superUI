import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import ETHIMG from '../../../../assets/img/ETH.png';
import AVATARIMG from '../../../../assets/img/avatar.png';
import { getAccountsInterface } from '../../../main/services/accountService';
import { useCurrentChainParams } from '../../hooks/useCurrentChainParams';
import { useAccountsState } from '../../states/account/reducer';
import { useChainState } from '../../states/chain/reducer';
import { useAppDispatch } from '../../states/hooks';
import { closeModalAll } from '../../states/modal/reducer';
import { formatBalanceWei, SplitAddress } from '../../utils/index';
import ButtonStyled from '../utility/ButtonStyled';

interface Props extends SimpleComponent {
  account?: getAccountsInterface;
}

const TransferModalWrapper = styled.div``;

const DropdownContainer = styled.div`
  position: absolute;
  top: 105%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
`;

const RelativeWrapper = styled.div`
  position: relative;
`;

function TransferModal({ account }: Props) {
  const { chainId } = useCurrentChainParams();
  const accounts = useAccountsState();
  const chainState = useChainState();
  const dispatch = useAppDispatch();
  const currentAccountsList = accounts ? accounts[chainId] || [] : [];

  const senderInit = currentAccountsList.find(
    (e) => e.publicKey === account?.publicKey,
  );
  const receiverInit = currentAccountsList.find(
    (e) => e.publicKey !== account?.publicKey,
  );

  const [sender, setSender] = useState<getAccountsInterface | undefined>(
    senderInit,
  );
  const [receiver, setReceiver] = useState<getAccountsInterface | undefined>(
    receiverInit,
  );
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingAccount, setEditingAccount] = useState<
    'sender' | 'receiver' | null
  >(null);

  const senderWrapperRef = useRef<HTMLDivElement>(null);
  const receiverWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingAccount === 'sender') {
        if (
          senderWrapperRef.current &&
          !senderWrapperRef.current.contains(event.target as Node)
        ) {
          setEditingAccount(null);
        }
      } else if (editingAccount === 'receiver') {
        if (
          receiverWrapperRef.current &&
          !receiverWrapperRef.current.contains(event.target as Node)
        ) {
          setEditingAccount(null);
        }
      }
    };

    if (editingAccount) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingAccount]);

  const handleTransfer = async () => {
    setIsLoading(true);
    const chain = chainState.chainConfing[chainId];

    if (!sender || !receiver) {
      setIsLoading(false);
      return;
    }

    const res = await window.electron.accounts.sendTransaction({
      from: sender.publicKey,
      to: receiver.publicKey,
      value: amount,
      chain,
      privateKey: sender.privateKey,
    });

    if (res.isSuccess) {
      Swal.fire({
        icon: 'success',
        title: 'Transfer Success',
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: `Transfer Failed`,
        text: `${res.error?.message}`,
        showConfirmButton: true,
      });
    }

    setIsLoading(false);
    dispatch(closeModalAll());
  };

  const renderAccountOptions = (type: 'sender' | 'receiver') => {
    return (
      <DropdownContainer className="shadow-xs">
        {currentAccountsList.map((acc) => (
          <div
            key={acc.publicKey}
            className="cursor-pointer dropdown-hover p-2"
            onClick={() => {
              if (type === 'sender') {
                setSender(acc);
              } else {
                setReceiver(acc);
              }
              setEditingAccount(null);
            }}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <img src={AVATARIMG} alt="" className="w-10 h-10" />
                <div>
                  <div className="text-gray-900 font-medium">{`Account ${acc.index}`}</div>
                  <div className="text-gray-600">
                    {SplitAddress(acc.publicKey)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-gray-900 font-medium">
                  {sender?.balance
                    ? `${formatBalanceWei(sender.balance)} ETH`
                    : ''}
                </div>
                <Icon
                  icon="akar-icons:chevron-down"
                  className="text-gray-500"
                />
              </div>
            </div>
          </div>
        ))}
      </DropdownContainer>
    );
  };

  return (
    <TransferModalWrapper>
      <div className="max-w-96 w-full">
        <div className="text-lg font-semibold text-gray-900 mb-6">
          Transfer Between Test Accounts
        </div>
        <RelativeWrapper ref={senderWrapperRef}>
          <div
            onClick={() =>
              setEditingAccount((prev) => (prev === 'sender' ? null : 'sender'))
            }
            className="cursor-pointer"
          >
            <UserTransfer
              title="From"
              name={sender?.publicKey ? `Account ${sender?.index}` : ''}
              address={SplitAddress(sender?.publicKey || '')}
              balance={
                sender?.balance ? `${formatBalanceWei(sender.balance)} ETH` : ''
              }
            />
          </div>
          {editingAccount === 'sender' && renderAccountOptions('sender')}
        </RelativeWrapper>
        <div className="flex justify-center mt-4">
          {/* <div className="p-2 rounded-lg border border-brand-300"> */}
            <Icon icon="icon-park-solid:down-c" className="text-brand-300 text-2xl" />
          {/* </div> */}
        </div>
        <RelativeWrapper ref={receiverWrapperRef} className="mt-2">
          <div
            onClick={() =>
              setEditingAccount((prev) =>
                prev === 'receiver' ? null : 'receiver',
              )
            }
            className="cursor-pointer"
          >
            <UserTransfer
              title="To"
              name={receiver?.publicKey ? `Account ${receiver?.index}` : ''}
              address={SplitAddress(receiver?.publicKey || '')}
              balance={
                receiver?.balance
                  ? `${formatBalanceWei(receiver.balance)} ETH`
                  : ''
              }
            />
          </div>
          {editingAccount === 'receiver' && renderAccountOptions('receiver')}
        </RelativeWrapper>
        <hr className="my-3 text-gray-200" />
        <div className="flex">
          <div className="w-2/4 flex gap-2 items-center border border-gray-300 border-r-0 rounded-l-xl p-3.5 py-2.5">
            <input
              type="number"
              className="border-0 outline-none placeholder-gray-300 text-gray-800 flex-1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="w-2/4 p-3.5 py-2.5 border-l-0 border border-gray-300 rounded-r-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 text-xs">
                50%
              </div>
              <div className="px-2 py-0.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 text-xs">
                All
              </div>
            </div>
            <div className="flex items-center gap-1">
              <img src={ETHIMG} alt="ETH" className="w-5 h-5 rounded-full" />
              <div className="text-gray-700">ETH</div>
            </div>
          </div>
        </div>
        <ButtonStyled
          onClick={handleTransfer}
          loading={isLoading}
          classContainer="mt-8"
        >
          Confirm Transfer
        </ButtonStyled>
      </div>
    </TransferModalWrapper>
  );
}

export default TransferModal;

interface UserTransferProps {
  title: string;
  name: string;
  address: string;
  balance: string;
  img?: string;
  onClick?: () => void;
}

const UserTransfer = ({
  title,
  address,
  balance,
  name,
  img,
  onClick,
}: UserTransferProps) => {
  return (
    <div onClick={onClick}>
      <div className="mb-1.5">{title}</div>
      <div className="border border-gray-300 rounded-lg py-2.5 px-3.5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <img src={AVATARIMG} alt="" className="w-10 h-10" />
            <div>
              <div className="text-gray-900 font-medium">{name}</div>
              <div className="text-gray-600">{address}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-gray-900 font-medium">{balance}</div>
            <Icon icon="akar-icons:chevron-down" className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
