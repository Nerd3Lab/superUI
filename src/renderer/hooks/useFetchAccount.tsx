import { useEffect } from 'react';
import { typeChainID } from '../../shared/constant/chain';
import { setAccounts } from '../states/account/reducer';
import { useChainState } from '../states/chain/reducer';
import { useAppDispatch } from '../states/hooks';
import { useRefreshState } from '../states/refresh/reducer';

function useFetchAccounts() {
  const chainState = useChainState();
  const dispatch = useAppDispatch();
  const refresh = useRefreshState();

  const getAccounts = async (chainId: typeChainID) => {
    // Call get-accounts from main process
    const chain = chainState.chainConfing[chainId];
    const accounts = await window.electron.accounts.getAccounts(chain);

    dispatch(setAccounts({ chainId, accounts }));
  };

  const allChainIds = [...chainState.l1, ...chainState.l2];

  useEffect(() => {
    if (allChainIds.length === 0 || !chainState.running) {
      return;
    }

    const fetchAccounts = async () => {
      for (const chainId of allChainIds) {
        await getAccounts(chainId);
      }
    };

    fetchAccounts();
  }, [allChainIds, chainState.running, refresh]);

  return null;
}

export default useFetchAccounts;
