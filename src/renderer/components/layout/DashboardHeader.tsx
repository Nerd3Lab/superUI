import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getPublicClient } from '../../../shared/utils/client';
import { useCurrentChainParams } from '../../hooks/useCurrentChainParams';
import { useChainState } from '../../states/chain/reducer';
import ChainIcon from '../utility/ChainIcon';
import SerchBox from '../utility/SearchBox';

interface Props extends SimpleComponent {}

const DashboardHeaderWrapper = styled.div``;

const HeaderMenuList = [
  // {
  //   title: 'Dashboard',
  //   icon: 'mdi:file-graph',
  //   link: '/dashboard/main',
  // },
  {
    title: 'Accounts',
    icon: 'flowbite:wallet-solid',
    link: '/dashboard/accounts',
  },
  {
    title: 'Transactions',
    icon: 'icon-park-solid:transaction',
    link: '/dashboard/transactions',
  },
  {
    title: 'Predeploy Contracts',
    icon: 'ri:contract-fill',
    link: '/dashboard/predeploy-contracts',
  },
  {
    title: 'Contracts',
    icon: 'ri:contract-fill',
    link: '/dashboard/contracts',
  },
  // {
  //   title: 'Events',
  //   icon: 'mdi:event-auto',
  //   link: '/dashboard/events',
  // },
  {
    title: 'Logs',
    icon: 'carbon:cloud-logging',
    link: '/dashboard/logs',
  },
  // {
  //   title: 'Settings',
  //   icon: 'lets-icons:setting-fill',
  //   link: '/dashboard',
  // },
];

function DashboardHeader(props: Props) {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { layer, chainId } = useCurrentChainParams();
  const [blockNumber, setBlockNumber] = useState('');

  const onClickMenu = (link: string) => {
    console.log({ link: `${link.toLowerCase()}/${layer}/${chainId}` });
    navigate(`${link.toLowerCase()}/${layer}/${chainId}`);
  };

  const chainState = useChainState();
  const chain = chainState.chainConfing[chainId];

  const menuItems =
    +layer === 1
      ? HeaderMenuList.filter((item) => item.title !== 'Predeploy Contracts')
      : HeaderMenuList;

  console.log({ layer });

  const getBlocknumber = async () => {
    if (!chain) return;
    const publicClient = getPublicClient(chain);
    if (!publicClient) return;
    const currentBlock = await publicClient.getBlockNumber();
    setBlockNumber(currentBlock.toString());
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAccounts = async () => {
      while (isMounted) {
        await getBlocknumber();
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    };

    fetchAccounts();

    return () => {
      isMounted = false;
    };
  }, [chainId, layer]);

  return (
    <DashboardHeaderWrapper className="pl-[18rem] z-100 pt-2 fixed top-0 left-0 w-full bg-white h-[8rem] flex flex-col justify-center px-6 border-b-1 border-gray-200">
      <div className="flex flex-wrap w-ful gap-12">
        <div>
          <p className="text-gray-600 mb-1 text-sm">Current Block</p>
          <b className="text-black">{blockNumber}</b>
        </div>

        <div>
          <p className="text-gray-600 mb-1 text-sm">Hardfork</p>
          <div className="flex items-center gap-2">
            {chain && <ChainIcon chain={chain.name as any} />}
            <b className="text-black">{chain?.name}</b>
          </div>
        </div>

        <div>
          <p className="text-gray-600 mb-1 text-sm">Network</p>
          <b className="text-black">{chain?.id}</b>
        </div>

        <div>
          <p className="text-gray-600 mb-1 text-sm">RPC Server</p>
          <b className="text-black">
            {chain ? chain.rpcUrls.default.http : ''}
          </b>
        </div>
        <div className="ml-auto">
          <SerchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex w-full mt-4 justify-start">
        {menuItems.map((menu) => (
          <div
            key={menu.title}
            className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded transition-all ${location.pathname.includes(menu.link.toLowerCase()) ? 'text-brand-500 bg-brand-25' : 'text-gray-700 bg-white'}`}
            onClick={() => onClickMenu(menu.link)}
          >
            <Icon icon={menu.icon} />
            <p className="text-base font-semibold">{menu.title}</p>
          </div>
        ))}
      </div>
    </DashboardHeaderWrapper>
  );
}

export default DashboardHeader;
