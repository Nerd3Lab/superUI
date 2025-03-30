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
  name?: string;
  createdAtBlockNumber?: string;
  isPredeploy?: boolean;
  deployer?: Address;
};

interface ContractState {
  mode?: 'hardhat' | 'foundry';
  contractDirectory: string;
  contractFile?: string;
  jsonFiles: AbiJson[];
  items: {
    [key in typeChainID]?: ContractItemType[];
  };
}

const initialState: ContractState = {
  mode: undefined,
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
    setJsonFile: (
      state,
      {
        payload,
      }: {
        payload: {
          jsonFiles: AbiJson[];
          contractFile: string;
        };
      },
    ) => {
      state.jsonFiles = payload.jsonFiles;
      state.contractFile = payload.contractFile;
    },
    resetContractState: (state) => {
      state.contractDirectory = '';
      state.jsonFiles = [];
      state.contractFile = '';
      state.items = {};
      state.mode = undefined;
    },
    resetContractDirectory: (state) => {
      state.contractDirectory = '';
    },
    resetContractFile: (state) => {
      state.contractFile = '';
    },
    setContractMode: (
      state,
      { payload }: { payload: 'hardhat' | 'foundry' },
    ) => {
      state.mode = payload;
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

      const findContract = state.items[chainId].find(
        (c) => c.contractAddress === contract.contractAddress,
      );
      if (!findContract) {
        state.items[chainId]?.unshift({
          ...contract,
        });
      } else {
        if (contract.name) {
          findContract.name = contract.name;
        }
        if (contract.contractName) {
          findContract.contractName = contract.contractName;
        }
        if (contract.abi) {
          findContract.abi = contract.abi;
        }
        if (contract.createdAtBlockNumber) {
          findContract.createdAtBlockNumber = contract.createdAtBlockNumber;
        }
      }
    },
  },
});

export const {
  setDirectory,
  addContractItem,
  setContractMode,
  setJsonFile,
  resetContractState,
  resetContractDirectory,
  resetContractFile,
} = ContractSlide.actions;
export default ContractSlide.reducer;
export const useContractState = () => useAppSelector((state) => state.contract);
