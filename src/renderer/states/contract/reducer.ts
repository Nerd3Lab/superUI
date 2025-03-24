import { createSlice } from '@reduxjs/toolkit';
import { AbiJson } from '../../../main/services/contractService';
import { useAppSelector } from '../hooks';

interface ContractState {
  type: 'hardhat' | 'foundry';
  contractDirectory: string;
  jsonFiles: AbiJson[];
}

const initialState: ContractState = {
  type: 'hardhat',
  contractDirectory: '',
  jsonFiles: [],
};

export const ContractSlide = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setDirectory: (state, { payload }) => {
      state.contractDirectory = payload.contractDirectory;
      state.jsonFiles = payload.jsonFiles;
    },
    setContractType: (
      state,
      { payload }: { payload: 'hardhat' | 'foundry' },
    ) => {
      state.type = payload;
    },
  },
});

export const { setDirectory } = ContractSlide.actions;
export default ContractSlide.reducer;
export const useContractState = () => useAppSelector((state) => state.contract);
