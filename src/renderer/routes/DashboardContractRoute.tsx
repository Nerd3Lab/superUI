import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ButtonStyled from '../components/utility/ButtonStyled';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';

interface Props extends SimpleComponent {}

const DashboardContractRouteWrapper = styled.div``;

const contracts = [
  {
    name: 'CoW Protocol: GPv2Settlement',
    subtitle: 'Testtesttest',
    address: '0x9008D19f5...D609715',
    owner: '0x38f4...06f3c4',
    timestamp: '29/03/2025 11:33',
    balance: '70.00 ETH',
  },
  {
    name: 'MetaBridge',
    subtitle: '@johndoe',
    address: '0x9008D19f5...D609715',
    owner: '0x38f4...06f3c4',
    timestamp: '29/03/2025 11:33',
    balance: '70.00 ETH',
  },
  {
    name: 'Financial Model: TRX Settlement',
    subtitle: 'ProjectTest',
    address: '0x9008D19f5...D609715',
    owner: '0x38f4...06f3c4',
    timestamp: '29/03/2025 11:33',
    balance: '70.00 ETH',
  },
  {
    name: 'CoW Protocol: GPv2Settlement',
    subtitle: 'Testtesttest',
    address: '0x9008D19f5...D609715',
    owner: '0x38f4...06f3c4',
    timestamp: '29/03/2025 11:33',
    balance: '70.00 ETH',
  },
];

function DashboardContractRoute(props: Props) {
  const { chainId, layer } = useCurrentChainParams();
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
      <div className="border-gray-200  border grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500">
        <div className="py-3 px-6 col-span-3">Contract name</div>
        <div className="py-3 px-6 col-span-2">Address</div>
        <div className="py-3 px-6 col-span-2">Owner</div>
        <div className="py-3 px-6 col-span-2">Timestamp</div>
        <div className="py-3 px-6 col-span-2">ETH balance</div>
        <div className="py-3 px-6 col-span-1"></div>
      </div>
      {contracts.map((contract) => {
        return (
          <div className="border-gray-200 border grid grid-cols-12 gap-4 items-center last:rounded-b-xl">
            <div className="py-4 px-6 col-span-3">
              <div className="flex gap-3">
                <img
                  src="/icons/truffle.png"
                  alt=""
                  className="w-10 h-10 rounded-b-full"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {contract.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {contract.subtitle}
                  </div>
                </div>
              </div>
            </div>
            <div className="py-4 px-6 col-span-2 text-gray-600 text-sm">
              {contract.address}
            </div>
            <div className="py-4 px-6 col-span-2 text-gray-600 text-sm">
              {contract.owner}
            </div>
            <div className="py-4 px-6 col-span-2 text-gray-600 text-sm">
              {contract.timestamp}
            </div>
            <div className="py-4 px-6 col-span-2 text-gray-900 text-sm font-medium">
              {contract.balance}
            </div>
            <div className="py-4 px-6 col-span-1">
              <Icon icon="material-symbols:edit-outline" />
            </div>
          </div>
        );
      })}
    </DashboardContractRouteWrapper>
  );
}

export default DashboardContractRoute;
