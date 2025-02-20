import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  getAccountsInterface,
  getAccountsResponse,
} from '../../main/services/accountService';
import Pagination from '../components/utility/Pagination';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';
import { useChainState } from '../states/chain/reducer';

interface Props extends SimpleComponent {}

const DashboardEventsRouteWrapper = styled.div``;

function DashboardEventsRoute(props: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const chainState = useChainState();
  const [selectedAccount, setSelectedAccount] =
    useState<getAccountsInterface>();

  const { layer, chainId } = useCurrentChainParams();
  const [accounts, setAccounts] = useState<getAccountsResponse>([]);

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
            <tr className="border-b-1 border-gray-200">
              <td className="text-left py-4">
                <div className="text-gray-900 text-sm font-medium">
                  CoW Protocol: GPv2Settlement
                </div>
                <div className="text-gray-600 text-sm">Testtesttest</div>
              </td>
              <td className="text-left py-4">
                <div className="text-gray-600 text-sm">
                  Jan-23-2025 01:54:37 PM +UTC
                </div>
              </td>
              <td className="text-left py-4">
                <div className="text-gray-600 text-sm">0x38f4...06Eb0a4</div>
              </td>
              <td className="text-left py-4">
                <div className="text-gray-600 text-sm">0x38f4...06Eb0a4</div>
              </td>
              <td className="text-left">
                <Link className="flex items-center" to="/dashboard/events/1">
                  <Icon
                    icon="prime:pencil"
                    className="cursor-pointer text-2xl text-gray-400"
                  />
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={10}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      />
    </DashboardEventsRouteWrapper>
  );
}

export default DashboardEventsRoute;
