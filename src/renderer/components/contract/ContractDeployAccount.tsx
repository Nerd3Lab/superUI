import { useRef, useState } from 'react';
import styled from 'styled-components';
import AVATARIMG from '../../../../assets/img/avatar.png';
import ETHIMG from '../../../../assets/img/ETH.png';
import { Icon } from '@iconify/react';
import { useAccountsState } from '../../states/account/reducer';
import { useCurrentChainParams } from '../../hooks/useCurrentChainParams';
import { formatBalanceWei } from '../../utils/index';
import { DeployContractParam } from '../../routes/DashboardContractsRoute';
import { getAccountsInterface } from '../../../main/services/accountService';

interface Props extends SimpleComponent {
  deployValue: DeployContractParam;
  onChageValue: (key: string, value: any) => void;
}

const ContractDeployAccountWrapper = styled.div``;

function ContractDeployAccount({ deployValue, onChageValue }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState<string>('');

  const accounts = useAccountsState();
  const { chainId } = useCurrentChainParams();
  const currentAccountsList = accounts ? accounts[chainId] || [] : [];

  const onClickAddress = (account: getAccountsInterface) => {
    onChageValue('account', account);
    setIsOpen(false);
  };

  return (
    <ContractDeployAccountWrapper>
      <hr className="my-3 border-gray-200" />
      <div className="flex gap-8">
        <div className="w-64">
          <div className="text-gray-900 text-sm font-semibold">
            Deployer Address <span className="text-red-600">*</span>
          </div>
        </div>
        <div className="w-full relative" ref={dropdownRef}>
          <div
            className="border h-16 border-gray-300 rounded-lg py-2.5 px-3.5 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {deployValue.account && (
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={AVATARIMG}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-gray-900 font-medium">
                      Account {deployValue.account.index}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {deployValue.account.publicKey}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-900 font-medium">
                    {formatBalanceWei(deployValue.account.balance)} ETH
                  </div>
                  <Icon
                    icon="akar-icons:chevron-down"
                    className="text-gray-500"
                  />
                </div>
              </div>
            )}
          </div>
          {isOpen && (
            <div className="absolute w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-2 z-10 transition-all px-4 py-2">
              {currentAccountsList.map((account) => {
                return (
                  <div
                    onClick={() => onClickAddress(account)}
                    className="flex justify-between py-1 px-2 text-sm cursor-pointer dropdown-hover"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={AVATARIMG}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <div className="text-gray-900 font-medium">
                          Account {account.index}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {account.publicKey}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-gray-900 font-medium">
                        {formatBalanceWei(account.balance)} ETH
                      </div>
                      <Icon
                        icon="akar-icons:chevron-down"
                        className="text-gray-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <hr className="my-3 border-gray-200" />
      <div className="flex gap-8">
        <div className="w-64">
          <div className="text-gray-900 text-sm font-semibold">
            Value <span className="text-red-600">*</span>
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-2/4 flex gap-2 items-center border border-gray-300 border-r-0 rounded-l-xl p-3.5 py-2.5">
            <input
              type="number"
              className="border-0 outline-none placeholder-gray-300 text-gray-800 flex-1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="w-2/4 p-3.5 py-2.5 border-l-0 border border-gray-300 rounded-r-xl flex items-center justify-end gap-3">
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
      </div>
      <hr className="my-3 border-gray-200" />
    </ContractDeployAccountWrapper>
  );
}

export default ContractDeployAccount;
