import { formatEther } from 'viem';

export function SplitAddress(address: any) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export function formatBalanceWei(balance: string, decimals = 2) {
  const balanceBigInt = BigInt(balance);
  return (+formatEther(balanceBigInt)).toFixed(decimals);
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function formatTimeFromTimestamp(time: number) {
  return new Date(time).toLocaleString();
}
