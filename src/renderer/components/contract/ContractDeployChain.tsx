import styled from 'styled-components';
import { useChainState } from '../../states/chain/reducer';
import ChainIcon from '../utility/ChainIcon';
import { useCurrentChainParams } from '../../hooks/useCurrentChainParams';
import { DeployContractParam } from '../../routes/DashboardContractDeployRoute';

interface Props extends SimpleComponent {
  deployValue: DeployContractParam;
  onChageValue: (key: string, value: any) => void;
}

const ContractDeployChainWrapper = styled.div``;

function ContractDeployChain({}: Props) {
  const chainState = useChainState();
  const { chainId } = useCurrentChainParams();
  const chain = chainState.chainConfing[chainId];
  return (
    <ContractDeployChainWrapper>
      <div className="flex">
        <div className="w-64">
          <div className="text-gray-900 text-sm font-semibold">Chain</div>
        </div>
        <div className="flex items-center">
          <ChainIcon chain={chain?.name} className="w-6 h-6" />
          <span className="text-gray-800 font-medium">{chain?.name}</span>
        </div>
      </div>
    </ContractDeployChainWrapper>
  );
}

export default ContractDeployChain;
