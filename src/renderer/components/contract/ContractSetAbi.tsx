import styled from 'styled-components';
import {
  ContractItemType,
  setABIandNameContract,
} from '../../states/contract/reducer';
import { useEffect, useState } from 'react';
import Input from '../utility/Input';
import ButtonStyled from '../utility/ButtonStyled';
import { formatAbi } from 'abitype';
import { useAppDispatch } from '../../states/hooks';
import { typeChainID } from '../../../shared/constant/chain';
import Swal from 'sweetalert2';

interface Props extends SimpleComponent {
  contract: ContractItemType;
  chainId: typeChainID;
}

const ContractSetAbiWrapper = styled.div``;

function ContractSetAbi({ contract, chainId }: Props) {
  const [name, setName] = useState('');
  const [abi, setAbi] = useState('');
  const [checkAbi, setCheckAbi] = useState<boolean | null>(null);

  const checkABIFunc = () => {
    try {
      // Parse and validate ABI string
      const abiArray = JSON.parse(abi);

      // Check if valid array
      if (!Array.isArray(abiArray)) {
        throw new Error('ABI must be an array');
      }

      // Validate ABI format using abitype
      const formattedAbi = formatAbi(abiArray);

      // Additional validation that ABI contains function/event definitions
      if (abiArray.length === 0) {
        throw new Error('ABI array cannot be empty');
      }

      // All validation passed
      setCheckAbi(true);
      return formattedAbi;
    } catch (error) {
      setCheckAbi(false);
      return null;
    }
  };

  useEffect(() => {
    checkABIFunc();
  }, [abi]);

  const disabled = !name || !checkAbi;

  const confirm = () => {
    const formattedAbi = checkABIFunc();
    if (!formattedAbi) return;

    dispatch(
      setABIandNameContract({
        chainId: chainId,
        contractAddress: contract.contractAddress,
        name: name,
        contractName: contract.contractName || '',
        abi: JSON.parse(abi),
      }),
    );

    Swal.fire({
      title: 'Success!',
      text: 'Contract ABI and name have been updated',
      icon: 'success',
    });
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    setName(contract.name || '');
    if (contract.abi) {
      setAbi(JSON.stringify(contract.abi, null, 2));
    }
  }, []);

  return (
    <ContractSetAbiWrapper>
      <div className="w-[30rem] flex flex-col gap-4">
        <div className="text-lg font-semibold text-gray-900">
          Contract Settings
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-gray-600 text-base font-semibold">
            Contract Name
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contract name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-gray-600 text-base font-semibold">ABI</div>
          <textarea
            value={abi}
            onChange={(e) => setAbi(e.target.value)}
            placeholder="Paste ABI here"
            className="w-full h-48 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          />
          <p className="text-base text-right">** Ex: Array {`[...]`} **</p>
          <p className="text-base text-brand-500 text-right h-4">
            {!checkAbi && abi ? 'Invalid ABI' : ''}
            {!checkAbi && !abi ? 'Please insert ABI And Name' : ''}
          </p>
        </div>

        <ButtonStyled disabled={disabled} onClick={confirm}>
          Confirm
        </ButtonStyled>
      </div>
    </ContractSetAbiWrapper>
  );
}

export default ContractSetAbi;
