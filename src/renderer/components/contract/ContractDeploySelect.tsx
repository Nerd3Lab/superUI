import styled from 'styled-components';
import Radio from '../utility/Radio';
import Select, { Option } from '../utility/SelectOption';
import { useContractState } from '../../states/contract/reducer';
import { useAppDispatch } from '../../states/hooks';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { DeployContractParam } from '../../routes/DashboardContractDeployRoute';
import {
  AbiItem,
  AbiJson,
  InputAbiItem,
} from '../../../main/services/contractService';

interface Props extends SimpleComponent {
  deployValue: DeployContractParam;
  onChageValue: (key: string, value: any) => void;
  initValueInput: (inputAbiItem: InputAbiItem[]) => void;
  currentABI?: AbiJson;
}

function ContractDeploySelect({
  deployValue,
  onChageValue,
  initValueInput,
  currentABI,
}: Props) {
  const contractState = useContractState();
  const directory = contractState.contractDirectory;
  const dispatch = useAppDispatch();
  const [selectedRadio, setSelectedRadio] = useState<'autoload' | 'manual'>(
    'autoload',
  );

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
          description={directory ? directory : 'Please select a directory'}
          checked={selectedRadio === 'autoload'}
          onChange={() => setSelectedRadio('autoload')}
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
            description="Select or drop your ABI file here"
            checked={selectedRadio === 'manual'}
            onChange={() => setSelectedRadio('manual')}
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
                    type="text"
                    // value={directory || 'Your ABI'}
                    readOnly
                    className="flex-1 text-gray-500 truncate border border-gray-300 px-3.5 py-2.5 rounded-l-lg bg-white border-r-0"
                  />
                  <button className="text-gray-700 font-medium hover:bg-gray-200 border border-gray-300 px-3.5 py-2.5 rounded-r-lg bg-white">
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
