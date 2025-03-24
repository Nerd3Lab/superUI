import { configureStore } from '@reduxjs/toolkit';
// import ModalReducer from './modal/reducer';
// import LayoutReducer from './layout/reducer';
// import { RefreshSlide } from './refresh/reducer';
import { ChainSlide } from './chain/reducer';
import { ModalSlide } from './modal/reducer';
import { AccountsSlide } from './account/reducer';
import { TransactionSlide } from './transaction/reducer';
import { ContractSlide } from './contract/reducer';

export const store = configureStore({
  reducer: {
    // modal: ModalReducer,
    // layout: LayoutReducer,
    // refresh: RefreshSlide.reducer,
    chain: ChainSlide.reducer,
    modal: ModalSlide.reducer,
    accounts: AccountsSlide.reducer,
    transaction: TransactionSlide.reducer,
    contract: ContractSlide.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
