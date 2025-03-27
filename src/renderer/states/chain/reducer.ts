import { createSlice } from '@reduxjs/toolkit';
import {
  chainMapID,
  getDefinedChain,
  typeChain,
  typeChainID,
} from '../../../shared/constant/chain';
import { useAppSelector } from '../hooks';
import { revertAllRedux } from '../action';

export interface ChainConfigType {
  name: string;
  id: number;
  nativeCurrency: {
    decimals: number;
    name: string;
    symbol: string;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
  };
}

interface ChainState {
  mode?: 'fork' | 'quick';
  name?: string;
  isLoading?: boolean;
  loading: null | boolean;
  running: null | boolean;
  error: null | boolean;
  l1: typeChainID[];
  l2: typeChainID[];
  chainIndex: {
    [key in typeChainID]?: number;
  };
  chainLogsPath?: {
    [key in typeChainID]?: string;
  };
  chainConfing: {
    [key in typeChainID]?: ChainConfigType;
  };
}

const initialState: ChainState = {
  mode: undefined,
  name: undefined,
  isLoading: false,
  loading: null,
  running: null,
  error: null,
  l1: [],
  l2: [],
  chainConfing: {},
  chainIndex: {},
  chainLogsPath: {},
};

interface forkModePayloadInterface {
  name: string;
  l2: typeChain[];
}

export const ChainSlide = createSlice({
  name: 'chain',
  initialState,
  extraReducers: (builder) =>
    builder.addCase(revertAllRedux, () => initialState),
  reducers: {
    runQuickMode(state, { payload }) {
      state.mode = 'quick';
      state.name = payload.name;
      state.isLoading = true;
      state.l1 = [chainMapID.local];
      state.l2 = [chainMapID.OPChainA, chainMapID.OPChainB];
      state.chainIndex = {
        [chainMapID.local]: 0,
        [chainMapID.OPChainA]: 1,
        [chainMapID.OPChainB]: 2,
      };
      state.chainConfing = {
        [chainMapID.local]: getDefinedChain('local', 0),
        [chainMapID.OPChainA]: getDefinedChain('OPChainA', 1),
        [chainMapID.OPChainB]: getDefinedChain('OPChainB', 2),
      };
    },
    runForkMode(state, { payload }: { payload: forkModePayloadInterface }) {
      state.mode = 'fork';
      state.name = payload.name;
      state.isLoading = true;
      state.l1 = [chainMapID.mainnet];
      state.l2 = payload.l2.map((chain) => chainMapID[chain]);
      state.chainIndex = {
        [chainMapID.mainnet]: 0,
        ...payload.l2.reduce(
          (acc, chain, index) => {
            acc[chainMapID[chain]] = index + 1;
            return acc;
          },
          {} as { [key in typeChainID]?: number },
        ),
      };
      state.chainConfing = {
        [chainMapID.mainnet]: getDefinedChain('mainnet', 0),
        ...payload.l2.reduce(
          (acc, chain, index) => {
            acc[chainMapID[chain]] = getDefinedChain(chain, index + 1);
            return acc;
          },
          {} as { [key in typeChainID]?: ReturnType<typeof getDefinedChain> },
        ),
      };
    },
    exitMode(state) {
      state.mode = undefined;
      state.name = undefined;
      state.isLoading = false;
      state.loading = null;
      state.running = null;
      state.error = null;
      state.l1 = [];
      state.l2 = [];
      state.chainIndex = {};
      state.chainConfing = {};
      state.chainLogsPath = {};
    },
    setStatus(
      state,
      {
        payload,
      }: {
        payload: {
          loading: boolean;
          running: boolean;
          error: boolean;
          chainLogsPath?: {
            [key in typeChainID]?: string;
          };
        };
      },
    ) {
      state.loading = payload.loading;
      state.running = payload.running;
      state.error = payload.error;
      state.chainLogsPath = payload.chainLogsPath;
    },
  },
});

export const useChainState = () => useAppSelector((state) => state.chain);
export const { runQuickMode, setStatus, exitMode } = ChainSlide.actions;
export default ChainSlide.reducer;
