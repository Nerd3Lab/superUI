// write me basic reducer

import { createSlice } from '@reduxjs/toolkit';
import { typeChainID } from '../../../shared/constant/chain';
import { TransactionType } from '../../../main/services/transactionService';
import { useAppSelector } from '../hooks';
import { revertAllRedux } from '../action';
type TransactionItem = {
  [key in typeChainID]?: TransactionType[];
};

type TransactionExist = {
  [key: string]: boolean;
};

interface TransactionState {
  items: TransactionItem;
  isExist: TransactionExist;
}

const initialState: TransactionState = {
  items: {},
  isExist: {},
};

export const TransactionSlide = createSlice({
  name: 'transaction',
  initialState,
  extraReducers: (builder) =>
    builder.addCase(revertAllRedux, () => initialState),
  reducers: {
    addTransaction(
      state,
      {
        payload,
      }: {
        payload: {
          chainId: typeChainID;
          transaction: TransactionType;
        };
      },
    ) {
      const { chainId, transaction } = payload;

      if (state.isExist[transaction.hash]) {
        return;
      }

      state.isExist[transaction.hash] = true;

      if (!state.items[chainId]) {
        state.items[chainId] = [];
      }

      state.items[chainId]?.unshift(transaction);
    },
  },
});

export const useTransactionsState = () =>
  useAppSelector((state) => state.transaction);
export const {} = TransactionSlide.actions;
export default TransactionSlide.reducer;
