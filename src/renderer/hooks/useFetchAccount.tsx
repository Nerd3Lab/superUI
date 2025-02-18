import { useEffect } from 'react';
import { typeChainID } from '../../shared/constant/chain';
import { setAccounts } from '../states/account/reducer';
import { useChainState } from '../states/chain/reducer';
import { useAppDispatch } from '../states/hooks';

function useFetchAccounts() {
  const chainState = useChainState();
  const dispatch = useAppDispatch();

  const getAccounts = async (chainId: typeChainID) => {
    // Call get-accounts from main process
    const chain = chainState.chainConfing[chainId];
    const accounts = await window.electron.accounts.getAccounts(chain);

    dispatch(setAccounts({ chainId, accounts }));
  };

  const allChainIds = [...chainState.l1, ...chainState.l2];

  useEffect(() => {
    let isMounted = true;
    if (allChainIds.length === 0 || !chainState.running) {
      isMounted = false;
      return;
    };

    const fetchAccounts = async () => {
      while (isMounted) {
        for (const chainId of allChainIds) {
          await getAccounts(chainId);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    };

    fetchAccounts();

    return () => {
      isMounted = false;
    };
  }, [allChainIds, chainState.running]);

  return null;
}

export default useFetchAccounts;
