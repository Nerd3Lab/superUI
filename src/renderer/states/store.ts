import { configureStore, createAction } from '@reduxjs/toolkit';
import ChainSlide from './chain/reducer';
import ModalSlide from './modal/reducer';
import AccountsSlide from './account/reducer';
import TransactionSlide from './transaction/reducer';
import ContractSlide from './contract/reducer';
import RefreshSlide from './refresh/reducer';

export const store = configureStore({
  reducer: {
    // modal: ModalReducer,
    // layout: LayoutReducer,
    refresh: RefreshSlide,
    chain: ChainSlide,
    modal: ModalSlide,
    accounts: AccountsSlide,
    transaction: TransactionSlide,
    contract: ContractSlide,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
