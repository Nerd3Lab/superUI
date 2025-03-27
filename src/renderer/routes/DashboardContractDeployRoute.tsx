import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ButtonStyled from '../components/utility/ButtonStyled';
import ContractDeploySelect from '../components/contract/ContractDeploySelect';
import ContractDeployInput from '../components/contract/ContractDeployInput';
import ContractDeployChain from '../components/contract/ContractDeployChain';
import ContractDeployAccount from '../components/contract/ContractDeployAccount';
import { useAccountsState } from '../states/account/reducer';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import { getAccountsInterface } from '../../main/services/accountService';
import ContractDeploySetting from '../components/contract/ContractDeploySetting';
import { Option } from '../components/utility/SelectOption';
import {
  AbiItem,
  AbiJson,
  InputAbiItem,
} from '../../main/services/contractService';
import Swal from 'sweetalert2';
import { addContractItem, useContractState } from '../states/contract/reducer';
import { useChainState } from '../states/chain/reducer';
import { useAppDispatch } from '../states/hooks';
import { Link } from 'react-router-dom';

interface Props extends SimpleComponent {}

export interface DeployContractParam {
  selectContract?: Option;
  name: string;
  value: string;
  account?: getAccountsInterface;
  inputValue?: any;
}

const ContractsRouteWrapper = styled.div``;

function DashboardContractsRoute(props: Props) {
  const [deployValue, setDeployValue] = useState<DeployContractParam>({
    selectContract: undefined,
    name: '',
    value: '0',
    account: undefined,
  });
  const [inputValue, setInputValue] = useState<any[]>([]);

  const dispatch = useAppDispatch();
  const { chainId, layer } = useCurrentChainParams();
  console.log({ chainId, layer });
  const contractState = useContractState();
  const chainState = useChainState();
  const chain = chainState.chainConfing[chainId];
  const accounts = useAccountsState();
  const firstAccount = accounts ? accounts[chainId]?.[0] : undefined;

  const onChageValue = (key: string, value: any) => {
    setDeployValue((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const onChangeInputValue = (index: number, value: any) => {
    setInputValue((prev) => {
      const newInputs = [...prev];
      newInputs[index] = value;
      return newInputs;
    });
  };

  const initValueInput = (inputAbiItem: InputAbiItem[]) => {
    setInputValue(new Array(inputAbiItem.length).fill(''));
  };

  useEffect(() => {
    onChageValue('account', firstAccount);
  }, [chainId]);

  const getCurrentABI = () => {
    const selectContract = contractState.jsonFiles.find(
      (c) => c.name === deployValue.selectContract?.value,
    );

    return selectContract;
  };

  const confirmDeploy = async () => {
    if (!getCurrentABI() || !chain || !deployValue.account) return;

    const swal = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to deploy this contract?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Deploy',
    });

    if (!swal.isConfirmed) return;

    Swal.fire({
      title: 'Deploying Contract...',
      html: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const res = await window.electron.contract.deployContract({
      chain,
      abiJson: getCurrentABI() as AbiJson,
      contract: {
        ...deployValue,
        inputValue,
      },
    });

    Swal.close();

    if (res.isSuccess) {
      Swal.fire({
        icon: 'success',
        title: 'Contract Deploy success',
        showConfirmButton: false,
        timer: 1000,
      });
      dispatch(
        addContractItem({
          chainId,
          contract: {
            contractAddress: res.receipt.contractAddress!,
            name: deployValue.name,
            abi: res.payload.abiJson.content?.abi,
            createdAtBlockNumber: res.receipt.blockNumber.toString(),
          },
        }),
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: `Transfer Failed`,
        text: `${res.error?.message}`,
        showConfirmButton: true,
      });
    }
  };

  return (
    <ContractsRouteWrapper className="p-3">
      <Link to={`/dashboard/contracts/${layer}/${chainId}`}>
        <div className="flex gap-1.5 items-center text-brand-700 mb-6 cursor-pointer">
          <Icon icon="grommet-icons:form-previous-link" className="text-2xl" />
          <div className="text-sm font-semibold">Back to contracts list</div>
        </div>
      </Link>
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

          <ContractDeploySetting
            deployValue={deployValue}
            onChageValue={onChageValue}
          />
          <ContractDeploySelect
            deployValue={deployValue}
            onChageValue={onChageValue}
            initValueInput={initValueInput}
          />
          <ContractDeployInput
            deployValue={deployValue}
            onChageValue={onChageValue}
            inputValue={inputValue}
            onChangeInputValue={onChangeInputValue}
          />
          <ContractDeployAccount
            deployValue={deployValue}
            onChageValue={onChageValue}
          />
          <ContractDeployChain
            deployValue={deployValue}
            onChageValue={onChageValue}
          />
          <hr className="my-3 border-gray-200" />
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-semibold">Go back</div>
            <ButtonStyled onClick={confirmDeploy}>Deploy contract</ButtonStyled>
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
