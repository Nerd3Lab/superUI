import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import { useTransactionsState } from '../states/transaction/reducer';
import { formatTimeFromTimestamp, SplitAddress } from '../utils/index';

interface Props extends SimpleComponent {}

const DashboardEventsRouteWrapper = styled.div``;

function DashboardEventsRoute(props: Props) {
  const transactionState = useTransactionsState();
  const { chainId } = useCurrentChainParams();
  const transactionsList = transactionState.items[chainId];

  const logsList = (transactionsList || []).flatMap(
    ({ hash, timeStamp, logs }) =>
      (logs || []).map((log) => ({ hash, timeStamp, name: 'No name', ...log })),
  );

  return (
    <DashboardEventsRouteWrapper className="px-3">
      <div className="w-full text-sm h-[20rem]">
        <table className="w-full">
          <thead>
            <tr className="border-b-1 border-gray-200 text-gray-500 font-semibold">
              <th className="text-left py-3 text-xs">EVENT NAME</th>
              <th className="text-left py-3 text-xs">TIMESTAMP</th>
              <th className="text-left py-3 text-xs">ADDRESS</th>
              <th className="text-left py-3 text-xs">Transaction hash</th>
            </tr>
          </thead>
          <tbody className="overflow-scroll">
            {logsList.map((e) => {
              return (
                <tr className="border-b-1 border-gray-200">
                  <td className="text-left py-4">
                    <div className="text-gray-900 text-sm font-medium">
                      {e.name}
                    </div>
                    {/* <div className="text-gray-600 text-sm">Testtesttest</div> */}
                  </td>
                  <td className="text-left py-4">
                    <div className="text-gray-600 text-sm">
                      {formatTimeFromTimestamp(e.timeStamp)}
                    </div>
                  </td>
                  <td className="text-left py-4">
                    <div className="text-gray-600 text-sm">
                      {SplitAddress(e.address)}
                    </div>
                  </td>
                  <td className="text-left py-4">
                    <div className="text-gray-600 text-sm">
                      {SplitAddress(e.hash)}
                    </div>
                  </td>
                  <td className="text-left">
                    <Link
                      className="flex items-center"
                      to="/dashboard/events/1"
                    >
                      <Icon
                        icon="prime:pencil"
                        className="cursor-pointer text-2xl text-gray-400"
                      />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <Pagination
        totalPages={10}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      /> */}
    </DashboardEventsRouteWrapper>
  );
}

export default DashboardEventsRoute;
