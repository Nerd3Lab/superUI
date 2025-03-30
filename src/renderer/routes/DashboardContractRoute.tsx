import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ButtonStyled from '../components/utility/ButtonStyled';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import ContractCardItem from '../components/contract/ContractCardItem';
import { useContractState } from '../states/contract/reducer';

interface Props extends SimpleComponent {
  isPredeploy?: boolean;
}

const DashboardContractRouteWrapper = styled.div``;

function DashboardContractRoute(props: Props) {
  const { chainId, layer } = useCurrentChainParams();

  const contractState = useContractState();
  const contracts = (contractState.items[chainId] || []).filter((contract) =>
    props.isPredeploy ? contract.isPredeploy : !contract.isPredeploy,
  );

  console.log({ contracts });

  return (
    <DashboardContractRouteWrapper className="pt-4">
      <div className="py-5 px-6 border border-gray-200 rounded-t-xl border-b-0">
        <div className="flex justify-between items-center">
          <div className="text-gray-900 text-lg font-semibold">
            Contracts list
          </div>
          <Link to={`/dashboard/contracts/${layer}/${chainId}/deploy`}>
            <ButtonStyled>Deploy contract</ButtonStyled>
          </Link>
        </div>
      </div>
      <div className="border-gray-200 border grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500">
        <div className="py-3 px-6 col-span-4">Contract name</div>
        <div className="py-3 px-6 col-span-2">Address</div>
        <div className="py-3 px-6 col-span-2">Owner</div>
        <div className="py-3 px-6 col-span-2">Timestamp</div>
        <div className="py-3 px-6 col-span-2">ETH balance</div>
      </div>
      {contracts.map((contract) => {
        return (
          <ContractCardItem
            key={contract.contractAddress}
            contract={contract}
          />
        );
      })}
    </DashboardContractRouteWrapper>
  );
}

export default DashboardContractRoute;
