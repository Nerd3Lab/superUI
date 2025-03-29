import L2ToL2CrossDomainMessenger from './L2ToL2CrossDomainMessenger.json';
import CrossL2Inbox from './CrossL2Inbox.json';
import SuperchainTokenBridge from './SuperchainTokenBridge.json';
import SuperchainWETH from './SuperchainWETH.json';
import OptimismPortal from './OptimismPortal2.json';
import L1CrossDomainMessenger from './L1CrossDomainMessenger.json';
import L1StandardBridge from './L1StandardBridge.json';

export const AbiPredeploy: any = {
  L2ToL2CrossDomainMessenger,
  CrossL2Inbox,
  SuperchainTokenBridge,
  SuperchainWETH,
};

export const AbiL1: any = {
  OptimismPortal,
  L1CrossDomainMessenger,
  L1StandardBridge,
};
