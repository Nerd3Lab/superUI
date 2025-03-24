import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ButtonStyled from '../components/utility/ButtonStyled';
import ContractDeploySetting from '../components/contract/contractDeploySetting';
import ContractDeploySelect from '../components/contract/ContractDeploySelect';
import ContractDeployInput from '../components/contract/ContractDeployInput';
import ContractDeployChain from '../components/contract/ContractDeployChain';
import ContractDeployAccount from '../components/contract/ContractDeployAccount';
import { useAccountsState } from '../states/account/reducer';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import { getAccountsInterface } from '../../main/services/accountService';

interface Props extends SimpleComponent {}

export interface DeployContractParam {
  name: string;
  value: string;
  account?: getAccountsInterface;
  arg: any;
}

const ContractsRouteWrapper = styled.div``;

function DashboardContractsRoute(props: Props) {
  const [deployValue, setDeployValue] = useState<DeployContractParam>({
    name: '',
    value: '',
    account: undefined,
    arg: '',
  });

  const accounts = useAccountsState();
  const { chainId } = useCurrentChainParams();
  const firstAccount = accounts ? accounts[chainId]?.[0] : undefined;

  const onChageValue = (key: string, value: any) => {
    setDeployValue({ ...deployValue, [key]: value });
  };

  useEffect(() => {
    onChageValue('account', firstAccount);
  }, [chainId]);

  return (
    <ContractsRouteWrapper className="p-3">
      <div className="flex gap-1.5 items-center text-brand-700 mb-6 cursor-pointer">
        <Icon icon="grommet-icons:form-previous-link" className="text-2xl" />
        <div className="text-sm font-semibold">Back to contracts list</div>
      </div>
      <div className="w-full">
        <div className="overflow-scroll">
          <div className="mb-5">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              Deploy contract
            </div>
            <div className="text-gray-600">
              Deploy your contract to Superchain with one click
            </div>
          </div>

          <ContractDeploySetting />
          <ContractDeploySelect />
          <ContractDeployInput />
          <ContractDeployAccount
            deployValue={deployValue}
            onChageValue={onChageValue}
          />
          <ContractDeployChain />
          <hr className="my-3 border-gray-200" />
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-semibold">Go back</div>
            <ButtonStyled>Deploy contract</ButtonStyled>
          </div>
        </div>
        {/* <div className="w-1/4">
          <Stepper />
        </div> */}
      </div>
    </ContractsRouteWrapper>
  );
}

export default DashboardContractsRoute;
