import styled from 'styled-components';
import Input from '../utility/Input';
import { Icon } from '@iconify/react';
import Radio from '../utility/Radio';
import { useState } from 'react';
import { DeployContractParam } from '../../routes/DashboardContractDeployRoute';
import { useContractState } from '../../states/contract/reducer';
import InputArgString from './input/InputArgString';
import InputArgBool from './input/InputArgBool';
import InputArgInt from './input/InputArgInt';
import InputArgAny from './input/InputArgAny';

interface Props extends SimpleComponent {
  deployValue: DeployContractParam;
  onChageValue: (key: string, value: any) => void;
  onChangeInputValue: (key: number, value: any) => void;
  inputValue: any[];
  selectedModeAbi: 'autoload' | 'manual';
}

const ContractDeployInputWrapper = styled.div``;

function ContractDeployInput({
  deployValue,
  onChageValue,
  onChangeInputValue,
  inputValue,
  selectedModeAbi,
}: Props) {
  const contractState = useContractState();
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChageValue('name', e.target.value);
  };

  const selectContract =
    selectedModeAbi === 'autoload'
      ? contractState.jsonFiles.find(
          (c) => c.name === deployValue.selectContract?.value,
        )
      : contractState.jsonFiles[0];

  const abiItem = selectContract?.content?.abi.find(
    (abi) => abi.type === 'constructor',
  );
  const argInputs = abiItem?.inputs || [];

  return (
    <ContractDeployInputWrapper>
      <hr className="my-3 border-gray-200" />
      <div className="flex gap-8">
        <div className="w-64">
          <div className="text-gray-900 text-sm font-semibold">
            Contract name <span className="text-red-600">*</span>
          </div>
        </div>
        <Input
          value={deployValue.name}
          onChange={onChangeName}
          placeholder="Type your contract name"
          className="w-full"
        />
      </div>
      <hr className="my-3 border-gray-200" />
      <div className="flex gap-8">
        <div className="w-64">
          <div className="text-gray-900 text-sm font-semibold">
            Argument <span className="text-red-600">*</span>
          </div>
          <div className="text-gray-600 text-sm">Set contract parameter</div>
        </div>
        <div className="flex flex-col w-full gap-3">
          {argInputs.map((inp, index) => {
            if (inp.type === 'string' || inp.type === 'address')
              return (
                <InputArgString
                  index={index}
                  abi={inp}
                  onChangeInputValue={onChangeInputValue}
                  inputValue={inputValue}
                />
              );
            if (inp.type === 'bool')
              return (
                <InputArgBool
                  index={index}
                  abi={inp}
                  onChangeInputValue={onChangeInputValue}
                  inputValue={inputValue}
                />
              );
            if (
              (inp.type.startsWith('uint') && !inp.type.includes('[]')) ||
              (inp.type.startsWith('int') && !inp.type.includes('[]'))
            )
              return (
                <InputArgInt
                  index={index}
                  abi={inp}
                  onChangeInputValue={onChangeInputValue}
                  inputValue={inputValue}
                />
              );
            return (
              <InputArgAny
                index={index}
                abi={inp}
                onChangeInputValue={onChangeInputValue}
                inputValue={inputValue}
              />
            );
          })}
        </div>
      </div>
    </ContractDeployInputWrapper>
  );
}

export default ContractDeployInput;
