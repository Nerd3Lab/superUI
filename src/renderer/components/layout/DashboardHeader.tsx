import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ChainIcon from '../utility/ChainIcon';
import SerchBox from '../utility/SearchBox';
import { useCurrentChainParams } from '../../hooks/useCurrentChainParams';
import { useChainState } from '../../states/chain/reducer';
import { getPublicClient } from '../../../shared/utils/client';

interface Props extends SimpleComponent {}

const DashboardHeaderWrapper = styled.div``;

const HeaderMenuList = [
  {
    title: 'Dashboard',
    icon: 'mdi:file-graph',
    link: '/dashboard/main',
  },
  {
    title: 'account',
    icon: 'flowbite:wallet-solid',
    link: '/dashboard/account',
  },
  {
    title: 'Transactions',
    icon: 'icon-park-solid:transaction',
    link: '/dashboard/transactions',
  },
  {
    title: 'Contracts',
    icon: 'ri:contract-fill',
    link: '/dashboard',
  },
  {
    title: 'Events',
    icon: 'mdi:event-auto',
    link: '/dashboard',
  },
  {
    title: 'Logs',
    icon: 'carbon:cloud-logging',
    link: '/dashboard',
  },
  {
    title: 'Settings',
    icon: 'lets-icons:setting-fill',
    link: '/dashboard',
  },
];

function DashboardHeader(props: Props) {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { layer, chainId } = useCurrentChainParams();
  const [blockNumber, setBlockNumber] = useState('');

  const onClickMenu = (title: string) => {
    navigate(`/dashboard/${title.toLowerCase()}/${layer}/${chainId}`);
  };

  const chainState = useChainState();
  const chain = chainState.chainConfing[chainId];

  const getBlocknumber = async () => {
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
    <DashboardHeaderWrapper className="w-full bg-white py-5 px-6 border-b-1 border-gray-200">
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
          <b className="text-black">{chain ? chain.rpcUrls.default.http : ""}</b>
        </div>
        <div className="ml-auto">
          <SerchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex w-full mt-4 justify-start">
        {HeaderMenuList.map((menu) => (
          <Link to={menu.link} key={`link-menu-head-${menu.title}`}>
            <div
              key={menu.title}
              className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded transition-all ${location.pathname.includes(menu.title) ? 'text-brand-500 bg-brand-25' : 'text-gray-700 bg-white'}`}
              onClick={() => onClickMenu(menu.title)}
            >
              <Icon icon={menu.icon} />
              <p className="text-base font-semibold">{menu.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardHeaderWrapper>
  );
}

export default DashboardHeader;
