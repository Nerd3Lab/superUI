// write me basic reducer

import { createSlice } from '@reduxjs/toolkit';
import { typeChainID } from '../../../shared/constant/chain';
import { TransactionType } from '../../../main/services/transactionService';

type TransactionState = {
  [key in typeChainID]?: TransactionType[];
};

const initialState: TransactionState = {};

export const TransactionSlide = createSlice({
  name: 'transaction',
  initialState,
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
      if (!state[chainId]) {
        state[chainId] = [];
      }
      state[chainId]?.push(transaction);
    }
  },
});

export const {} = TransactionSlide.actions;
export default TransactionSlide.reducer;
