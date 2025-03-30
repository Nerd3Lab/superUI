import { useEffect } from 'react';
import { typeChainID } from '../../shared/constant/chain';
import { setAccounts } from '../states/account/reducer';
import { useChainState } from '../states/chain/reducer';
import { useAppDispatch } from '../states/hooks';
import { TransactionChainInterface } from '../../main/services/transactionService';
import { TransactionSlide } from '../states/transaction/reducer';
import { addContractItem } from '../states/contract/reducer';
import { Address } from 'viem';

function useFetchTransaction() {
  const chainState = useChainState();
  const dispatch = useAppDispatch();

  // const getAccounts = async (chainId: typeChainID) => {
  //   // Call get-accounts from main process
  //   const chain = chainState.chainConfing[chainId];
  //   const accounts = await window.electron.accounts.getAccounts(chain);
  // };

  const subscribeToChain = async (chainId: typeChainID) => {
    // Call subscribe from main process
    const chain = chainState.chainConfing[chainId];
    if (!chain) return;
    await window.electron.transaction.subscribe({ chain });
  };

  const allChainIds = [...chainState.l1, ...chainState.l2];

  useEffect(() => {
    if (allChainIds.length === 0 || !chainState.running) {
      return;
    }

    window.electron.ipcRenderer.on('transaction', (tx) => {
      const transaction = tx as TransactionChainInterface;
      // console.log('Transaction:', transaction);
      dispatch(
        TransactionSlide.actions.addTransaction({
          chainId: transaction.chain.id as typeChainID,
          transaction: transaction.transaction,
        }),
      );

      if (
        transaction.transaction.type == 'ContractCreated' &&
        transaction.transaction.status === 'success' &&
        transaction.transaction.contractAddress
      ) {
        dispatch(
          addContractItem({
            chainId: transaction.chain.id as typeChainID,
            contract: {
              contractAddress: transaction.transaction
                .contractAddress as Address,
              name: '',
              abi: undefined,
              createdAtBlockNumber:
                transaction.transaction.blockNumber.toString(),
              deployer: transaction.transaction.from as Address,
            },
          }),
        );
      }
    });

    allChainIds.forEach((chainId) => {
      // getAccounts(chainId);
      subscribeToChain(chainId);
    });
  }, [allChainIds, chainState.running]);

  return null;
}

export default useFetchTransaction;
