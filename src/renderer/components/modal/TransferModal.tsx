import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { TransferIcon } from '../../../../public/icons/transfer';
import ButtonStyled from '../utility/ButtonStyled';

interface Props extends SimpleComponent {}

const TransferModalWrapper = styled.div``;

function TransferModal() {
  return (
    <TransferModalWrapper>
      <div className="max-w-96 w-full">
        <div className="text-lg font-semibold text-gray-900 mb-6">
          Transfer Between Test Accounts
        </div>
        <UserTransfer
          title="From"
          name="Account 1"
          address="0x82ff8...386ecc"
          balance="66.444 ETH"
        />
        <div className="flex justify-center mt-2">
          <div className="p-2 rounded-lg border border-brand-300">
            <TransferIcon />
          </div>
        </div>
        <UserTransfer
          title="To"
          name="Account 1"
          address="0x82ff8...386ecc"
          balance="66.444 ETH"
        />
        <hr className="my-3 text-gray-200" />
        <div className="flex">
          <div className="w-2/4 flex gap-2 items-center border-1 border-gray-300 border-r-0 rounded-l-xl p-3.5 py-2.5 cursor-pointer text-gray-500">
            <input
              id="search"
              type="text"
              className="border-0 border-none placeholder-gray-300 outline-0 text-gray-800 cursor-pointer flex-1"
              value={66.444}
            />
          </div>
          <div className="w-2/4 p-3.5 py-2.5 border-l-0 border border-gray-300 rounded-r-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 text-xs">
                50%
              </div>
              <div className="px-2 py-.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 text-xs">
                All
              </div>
            </div>
            <div className="flex items-center gap-1">
              <img
                src="/icons/Protocol Icon.png"
                alt=""
                className="w-5 h-5 rounded-full"
              />
              <div className="text-gray-700">ETH</div>
            </div>
          </div>
        </div>
        <ButtonStyled classContainer="mt-8">Confirm Transfer</ButtonStyled>
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
}
const UserTransfer = ({
  title,
  address,
  balance,
  name,
  img,
}: UserTransferProps) => {
  return (
    <div>
      <div className="mb-1.5">{title}</div>
      <div className="border border-gray-300 rounded-lg py-2.5 px-3.5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <img src="/img/avatar.png" alt="" className="w-10 h-10" />
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
