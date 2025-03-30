import styled from 'styled-components';
import ButtonStyled from '../utility/ButtonStyled';
import Select, { Option } from '../utility/SelectOption';
import { useAppDispatch } from '../../states/hooks';
import {
  resetContractDirectory,
  resetContractFile,
  setContractMode,
  setDirectory,
  useContractState,
} from '../../states/contract/reducer';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { DeployContractParam } from '../../routes/DashboardContractDeployRoute';

interface Props extends SimpleComponent {
  deployValue: DeployContractParam;
  onChageValue: (key: string, value: any) => void;
  setInitialValue: () => void;
  setModeABI: (mode: 'autoload' | 'manual') => void;
}

const modeOption = [
  { value: 'hardhat', label: 'Hardhat', imgSrc: '/icons/hardhat.svg' },
  { value: 'foundry', label: 'Foundry', imgSrc: '/icons/foundry.png' },
];

function ContractDeploySetting({ setInitialValue, setModeABI }: Props) {
  const contractState = useContractState();
  const directory = contractState.contractDirectory;
  const dispatch = useAppDispatch();

  const handleSelection = (option: {
    value: string;
    label: string;
    imgSrc?: string;
  }) => {
    setModeABI('autoload');
    dispatch(setContractMode(option.value as any));
    setInitialValue();
    dispatch(resetContractDirectory());
    dispatch(resetContractFile());
  };

  const handleOpenDirectory = async () => {
    setModeABI('autoload');
    dispatch(resetContractFile());
    if (!contractState.mode) {
      Swal.fire({
        icon: 'info',
        title: `Select mode`,
        text: `Please select mode Hardhat or Foundry`,
        showConfirmButton: true,
      });
      return;
    }
    const res = await window.electron.contract.setDirectory(contractState.mode);
    if (res.isSuccess && res.contractDirectory && res.jsonFiles) {
      dispatch(setDirectory(res));
      setInitialValue();
    } else {
      Swal.fire({
        icon: 'error',
        title: `Select directory`,
        text: res.message || `Select directory failed`,
        showConfirmButton: true,
      });
    }
  };

  const mode = modeOption.find((e) => {
    return e.value === contractState.mode;
  });

  return (
    <div className="p-4 border rounded-xl bg-[#E8EBEF] border-[#18365C] flex flex-col gap-3">
      <div>
        <div className="text-gray-900 text-lg font-semibold">
          Developer Setting
        </div>
        <div className="text-gray-600 text-sm">
          Configure your contract's development environment
        </div>
      </div>
      <div className="flex gap-8 items-center">
        <div className="w-2/4">
          <div className="text-sm font-semibold text-gray-700">Mode</div>
          <div className="text-sm text-gray-600">
            Select your development environment
          </div>
        </div>
        <div className="w-2/4">
          <Select
            value={mode}
            options={modeOption}
            onSelect={handleSelection}
            placeholder="Select Mode"
            required
          />
        </div>
      </div>
      <div className="flex gap-8 items-center">
        <div className="w-2/4">
          <div className="text-sm font-semibold text-gray-700">
            Source directory
          </div>
        </div>
        <div className="w-2/4">
          <div className="flex items-center w-full">
            <input
              type="text"
              value={directory || 'Select a directory...'}
              readOnly
              className="text-gray-500 text-sm truncate border border-gray-300 px-3.5 py-2.5 rounded-l-lg bg-white border-r-0"
            />
            <button
              onClick={handleOpenDirectory}
              className="text-gray-700 font-medium hover:bg-gray-200 border border-gray-300 px-3.5 py-2.5 rounded-r-lg bg-white"
            >
              Open Directory
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <ButtonStyled>Save setting</ButtonStyled>
      </div>
    </div>
  );
}

export default ContractDeploySetting;
