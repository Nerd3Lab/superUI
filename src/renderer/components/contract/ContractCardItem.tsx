import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { ContractItemType } from '../../states/contract/reducer';
import { SplitAddress } from '../../utils/index';
import { useChainState } from '../../states/chain/reducer';
import { useCurrentChainParams } from '../../hooks/useCurrentChainParams';
import { useFetchBalance } from '../../hooks/useFetchBalance';
import { useTimeFromBlockNumber } from '../../hooks/useTimeFromBlockNumber';
import { useNavigate } from 'react-router-dom';
import CopyText from '../utility/CopyText';

interface Props extends SimpleComponent {
  contract: ContractItemType;
}

const ContractCardItemWrapper = styled.div`
  &:hover {
    background-color: #f5f5f5;
  }

  cursor: pointer;
`;

function ContractCardItem({ contract }: Props) {
  const { chainId, layer } = useCurrentChainParams();
  const chainState = useChainState();
  const chain = chainState.chainConfing[chainId];

  const balance = useFetchBalance(contract.contractAddress);
  const time = useTimeFromBlockNumber(chain, contract.createdAtBlockNumber);
  const navigate = useNavigate();

  const onClick = () => {
    navigate(
      `/dashboard/contracts/${layer}/${chainId}/${contract.contractAddress!}`,
    );
  };

  return (
    <ContractCardItemWrapper
      onClick={onClick}
      className="border-gray-200 border grid grid-cols-12 gap-4 items-center last:rounded-b-xl"
    >
      <div className="py-4 px-6 col-span-4">
        <div className="flex gap-3">
          <Icon
            icon={'lets-icons:check-fill'}
            className="text-xl text-emerald-500"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {contract.name}
            </div>
            <div className="text-gray-600 text-sm">{contract.contractName}</div>
          </div>
        </div>
      </div>
      <div className="py-4 px-6 col-span-2 text-gray-600 text-sm flex items-center">
        {contract.contractAddress
          ? SplitAddress(contract.contractAddress)
          : '-'}
        <CopyText value={contract.contractAddress} />
      </div>
      <div className="py-4 px-6 col-span-2 text-gray-600 text-sm flex items-center">
        {contract.deployer ? SplitAddress(contract.deployer) : '-'}
        {contract.deployer && <CopyText value={contract.contractAddress} />}
      </div>
      <div className="py-4 px-6 col-span-2 text-gray-600 text-sm">
        {time.format || '-'}
      </div>
      <div className="py-4 px-6 col-span-2 text-gray-900 text-sm font-medium">
        {balance.formatEth} ETH
      </div>
    </ContractCardItemWrapper>
  );
}

export default ContractCardItem;
