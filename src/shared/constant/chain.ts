import { defineChain } from 'viem';

export const AvailableForkChain = [
  'base',
  'lyra',
  'metal',
  'mode',
  'op',
  'orderly',
  'race',
  'tbn',
  'zora',
];

export type typeChain =
  | 'base'
  | 'lyra'
  | 'metal'
  | 'mode'
  | 'op'
  | 'orderly'
  | 'race'
  | 'tbn'
  | 'zora'
  | 'mainnet'
  | 'local'
  | 'OPChainA'
  | 'OPChainB';

export type typeChainID =
  | 8453
  | 957
  | 1750
  | 34443
  | 10
  | 291
  | 6805
  | 624
  | 7777777
  | 1
  | 900
  | 901
  | 902;

export const chainMapID: { [key in typeChain]: typeChainID } = {
  base: 8453,
  lyra: 957,
  metal: 1750,
  mode: 34443,
  op: 10,
  orderly: 291,
  race: 6805,
  tbn: 624,
  zora: 7777777,
  mainnet: 1,
  local: 900,
  OPChainA: 901,
  OPChainB: 902,
};

export const IDMapchain: { [key in typeChainID]: typeChain } = {
  8453: 'base',
  957: 'lyra',
  1750: 'metal',
  34443: 'mode',
  10: 'op',
  291: 'orderly',
  6805: 'race',
  624: 'tbn',
  7777777: 'zora',
  1: 'mainnet',
  900: 'local',
  901: 'OPChainA',
  902: 'OPChainB',
};

export const AvailableL1Chain = ['mainnet', 'local'];

export const getRpcUrl = (index: number): string => {
  if (index === 0) return 'http://localhost:8545';
  let port = 9544 + index;
  return `http://127.0.0.1:${port}`;
};

export const getDefinedChain = (
  chain: typeChain,
  index: number,
): ReturnType<typeof defineChain> => {
  return defineChain({
    name: chain,
    id: chainMapID[chain],
    nativeCurrency: {
      decimals: 18,
      name: `${chain.toUpperCase()} Ether`,
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [getRpcUrl(index)],
      },
    },
  });
};

