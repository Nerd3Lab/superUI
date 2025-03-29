import { createSlice } from '@reduxjs/toolkit';
import {
  AbiItem,
  AbiJson,
  SmartContractAbi,
} from '../../../main/services/contractService';
import { useAppSelector } from '../hooks';
import { typeChainID } from '../../../shared/constant/chain';
import { Address } from 'viem';
import { revertAllRedux } from '../action';

export type ContractItemType = {
  contractAddress: Address;
  abi?: AbiItem[];
  bytecode?: string;
  contractName?: string;
  name?:string;
  createdAtBlockNumber?: string;
  isPredeploy?: boolean;
};

interface ContractState {
  type: 'hardhat' | 'foundry';
  contractDirectory: string;
  jsonFiles: AbiJson[];
  items: {
    [key in typeChainID]?: ContractItemType[];
  };
}

const initialState: ContractState = {
  type: 'hardhat',
  contractDirectory: '',
  jsonFiles: [],
  items: {},
};

export const ContractSlide = createSlice({
  name: 'contract',
  initialState,
  extraReducers: (builder) =>
    builder.addCase(revertAllRedux, () => initialState),
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
    addContractItem: (
      state,
      {
        payload,
      }: {
        payload: {
          contract: ContractItemType;
          chainId: typeChainID;
        };
      },
    ) => {
      const { chainId, contract } = payload;

      if (!state.items[chainId]) {
        state.items[chainId] = [];
      }

      const exists = state.items[chainId]?.some(
        (item) => item.contractAddress === contract.contractAddress,
      );

      if (!exists) {
        state.items[chainId]?.push(contract);
      }
    },
  },
});

export const { setDirectory, addContractItem } = ContractSlide.actions;
export default ContractSlide.reducer;
export const useContractState = () => useAppSelector((state) => state.contract);
