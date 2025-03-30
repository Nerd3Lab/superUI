import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';
interface RefreshState {
  counter: number;
}

const initialState: RefreshState = {
  counter: 0,
};

export const RefreshSlide = createSlice({
  name: 'refresh',
  initialState,
  reducers: {
    increaseRefresh: (state) => {
      state.counter++;
    },
  },
});

export const { increaseRefresh } = RefreshSlide.actions;
export default RefreshSlide.reducer;

export const useRefreshState = () => useAppSelector((state) => state.refresh.counter);
