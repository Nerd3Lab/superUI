import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';
import { typeChainID } from '../../../shared/constant/chain';
import { getAccountsInterface } from '../../../main/services/accountService';

type AccountsState = {
  [key in typeChainID]?: getAccountsInterface[];
};

const initialState: AccountsState = {};

export const AccountsSlide = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts(
      state,
      {
        payload,
      }: {
        payload: { chainId: typeChainID; accounts: getAccountsInterface[] };
      },
    ) {
      const { chainId, accounts } = payload;
      state[chainId] = accounts;
    },
  },
});

export const useAccountsState = () => useAppSelector((state) => state.accounts);
export const { setAccounts } = AccountsSlide.actions;
export default AccountsSlide.reducer;
