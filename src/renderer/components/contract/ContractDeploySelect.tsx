import styled from 'styled-components';
import Radio from '../utility/Radio';
import Select, { Option } from '../utility/SelectOption';
import {
  resetContractState,
  setJsonFile,
  useContractState,
} from '../../states/contract/reducer';
import { useAppDispatch } from '../../states/hooks';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { DeployContractParam } from '../../routes/DashboardContractDeployRoute';
import {
  AbiItem,
  AbiJson,
  InputAbiItem,
} from '../../../main/services/contractService';
import Swal from 'sweetalert2';

interface Props extends SimpleComponent {
  deployValue: DeployContractParam;
  onChageValue: (key: string, value: any) => void;
  initValueInput: (inputAbiItem: InputAbiItem[]) => void;
  currentABI?: AbiJson;
  setInitialValue: () => void;
  selectedModeAbi: 'autoload' | 'manual';
  onChangeModeABI: (type: 'autoload' | 'manual') => void;
}

function ContractDeploySelect({
  deployValue,
  onChageValue,
  initValueInput,
  currentABI,
  setInitialValue,
  selectedModeAbi,
  onChangeModeABI,
}: Props) {
  const contractState = useContractState();
  const directory = contractState.contractDirectory;
  const dispatch = useAppDispatch();

  const contractList = contractState.jsonFiles.map((file) => ({
    value: file.name,
    label: file.name,
  }));

  const getCurrentInputs = () => {
    const selectContract = contractState.jsonFiles.find(
      (c) => c.name === deployValue.selectContract?.value,
    );

    const abiItem = selectContract?.content?.abi.find(
      (abi) => abi.type === 'constructor',
    );
    return abiItem?.inputs || [];
  };

  const onSelectContract = (val: Option) => {
    onChageValue('name', val.value);
    onChageValue('selectContract', val);

    initValueInput(getCurrentInputs());
  };

  useEffect(() => {
    initValueInput(getCurrentInputs());
  }, [deployValue.selectContract]);

  const handleOpenJsonFile = async () => {
    if (selectedModeAbi !== 'manual') {
      Swal.fire({
        icon: 'info',
        title: 'Auto-load mode active',
        text: 'Please switch to manual mode to upload ABI file directly',
        showConfirmButton: true,
      });
      return;
    }
    const res = await window.electron.contract.uploadAbi();
    if (res.isSuccess && res.contractDirectory && res.jsonFiles) {
      dispatch(
        setJsonFile({
          jsonFiles: res.jsonFiles,
          contractFile: res.contractDirectory,
        }),
      );
      onChageValue('name', res.jsonFiles[0].name || '');

      const abiItem = res.jsonFiles[0].content?.abi.find(
        (abi) => abi.type === 'constructor',
      );
      const inputs = abiItem?.inputs || [];

      initValueInput(inputs);
    } else {
      Swal.fire({
        icon: 'error',
        title: `Select json Abi`,
        text: res.message || `Select json file failed`,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="mt-4 flex gap-8">
      <div className="w-64">
        <div className="text-gray-900 text-sm font-semibold">
          Upload ABI <span className="text-red-600">*</span>
        </div>
        <div className="text-gray-600 text-sm">
          Choose an ABI file manually or auto-load
        </div>
      </div>
      <div className="w-full">
        <Radio
          name="abiSource"
          label="Use source from settings (Autoload ABI from project directory)"
          description={
            directory ? directory : 'Please select mode and source directory'
          }
          checked={selectedModeAbi === 'autoload'}
          onChange={() => onChangeModeABI('autoload')}
        />
        <Select
          value={deployValue.selectContract}
          options={contractList}
          label="Select Contract"
          onSelect={onSelectContract}
          required
          className="mt-2"
          placeholder="Please select a contract"
          disabled={contractList.length === 0 || !directory}
        />
        <div className="mt-4">
          <Radio
            name="abiSource"
            label="Manual upload (Upload ABI file manually)"
            description="(only .json file with ABI and bytecode are supported)"
            checked={selectedModeAbi === 'manual'}
            onChange={() => onChangeModeABI('manual')}
          />
          <div className="flex gap-8 items-center">
            <div className="flex items-center w-full">
              <div className="mt-2 w-full">
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Upload ABI
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center w-full">
                  <input
                    value={contractState.contractFile}
                    readOnly
                    className="flex-1 text-gray-500 truncate border border-gray-300 px-3.5 py-2.5 rounded-l-lg bg-white border-r-0"
                  />
                  <button
                    onClick={handleOpenJsonFile}
                    className="text-gray-700 cursor-pointer font-medium hover:bg-gray-200 border border-gray-300 px-3.5 py-2.5 rounded-r-lg bg-white"
                  >
                    <div className="flex">
                      <Icon
                        icon="material-symbols:upload-rounded"
                        className="w-5 h-5"
                      />
                      Upload
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {currentABI?.isValid === false && (
            <div className="text-red-500 text-sm h-8 flex items-center w-full mt-2">
              ** Invalid ABI file or bytecode **
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractDeploySelect;
