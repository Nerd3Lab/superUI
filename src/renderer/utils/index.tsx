import { formatEther } from "viem";

export function SplitAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export function formatBalanceWei(balance: string, decimals = 2) {
  const balanceBigInt = BigInt(balance);
  return (+(formatEther(balanceBigInt))).toFixed(decimals);
}
