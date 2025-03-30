import { useEffect } from 'react';
import { useAppDispatch } from '../states/hooks';
import { increaseRefresh } from '../states/refresh/reducer';

export const useRefresh = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    let isMounted = true;

    const fetchAccounts = async () => {
      while (isMounted) {
        dispatch(increaseRefresh());
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    };

    fetchAccounts();

    return () => {
      isMounted = false;
    };
  }, []);
};