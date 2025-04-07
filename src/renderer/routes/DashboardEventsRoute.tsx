import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import {
  useEventLogs,
  useTransactionsState,
} from '../states/transaction/reducer';
import { formatTimeFromTimestamp, SplitAddress } from '../utils/index';
import EventItem from '../components/event/EventItem';
import EventHeader from '../components/event/EventHeader';

interface Props extends SimpleComponent {}

const DashboardEventsRouteWrapper = styled.div``;

function DashboardEventsRoute(props: Props) {
  const transactionState = useTransactionsState();
  const { chainId } = useCurrentChainParams();
  const transactionsList = transactionState.items[chainId];

  const logsList = useEventLogs(chainId);

  return (
    <DashboardEventsRouteWrapper className="px-3">
      <div className="w-full">
        <table className="w-full">
          <EventHeader />
          <tbody className="overflow-scroll">
            {logsList.map((e, i) => {
              return <EventItem key={e.transactionHash + i} event={e} />;
            })}
          </tbody>
        </table>
      </div>
    </DashboardEventsRouteWrapper>
  );
}

export default DashboardEventsRoute;
