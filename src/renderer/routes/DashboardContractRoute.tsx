import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import ButtonStyled from '../components/utility/ButtonStyled';

interface Props extends SimpleComponent {}

const DashboardContractRouteWrapper = styled.div``;

function DashboardContractRoute(props: Props) {
  const { chainId, layer } = useCurrentChainParams();
  return (
    <DashboardContractRouteWrapper className="pt-4">
      <div className="flex items-center justify-end">
        <Link to={`/dashboard/contracts/deploy/${layer}/${chainId}`}>
          <ButtonStyled>Deploy contract</ButtonStyled>
        </Link>
      </div>

      <div className="space-y-6 overflow-y-auto h-full"></div>
    </DashboardContractRouteWrapper>
  );
}

export default DashboardContractRoute;
