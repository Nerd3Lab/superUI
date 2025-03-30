import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LOGO_IMG from '../../../../assets/img/logo.svg';
import { useCurrentChainParams } from '../../hooks/useCurrentChainParams';
import { ChainSlide, useChainState } from '../../states/chain/reducer';
import { useAppDispatch } from '../../states/hooks';
import ChainIcon from '../utility/ChainIcon';
import { revertAllRedux } from '../../states/action';
interface Props extends SimpleComponent {}

const DashboardSidebarWrapper = styled.div`
  .item-sidebar:hover {
    background-color: var(--color-brand-700);
    color: var(--color-white);
    transition: all 0.3s;
  }
`;

function DashboardSidebar(props: Props) {
  const chainState = useChainState();

  const chainConfig = chainState.chainConfing;
  const l1ChainList = chainState.l1.map((id) => chainConfig[id]);
  const l2ChainList = chainState.l2.map((id) => chainConfig[id]);
  const { layer, chainId } = useCurrentChainParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const exitProject = async () => {
    await window.electron.supersim.stopSupersim();
    // dispatch(ChainSlide.actions.exitMode());
    dispatch(revertAllRedux());
    navigate('/');
  };

  return (
    <DashboardSidebarWrapper className="fixed z-200 h-full w-[16rem] flex-none bg-gray-50 border-1 border-gray-200 flex flex-col rounded-xl p-5">
      <div className="mb-8">
        <img src={LOGO_IMG} alt="logo" className="h-10" />
      </div>
      <div
        onClick={exitProject}
        className="text-brand-700 cursor-pointer flex items-center gap-2 hovering"
      >
        <Icon icon="grommet-icons:form-previous-link" className="text-2xl" />
        <p className="text-sm font-semibold">Exit project</p>
      </div>

      {/* user */}
      <div className="my-3">
        <div className="flex items-center gap-2 bg-white border-1 border-gray-200 rounded-xl p-4 shadow">
          <div className="bg-radiant w-8 h-8 animate-trans rounded-full p-1 flex items-center justify-center">
            <Icon
              icon="icon-park-outline:blockchain"
              className="text-xl text-white"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Project</p>
            <p className="text-sm font-semibold text-black">
              {chainState?.name}
            </p>
          </div>
        </div>
      </div>

      {/* layer 2 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-500">Layer 2</p>
        <div className="flex flex-col gap-2">
          {l2ChainList.map((item) => (
            <div
              onClick={() => navigate(`/dashboard/accounts/2/${item?.id}`)}
              key={item?.id}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer item-sidebar
                ${chainId === item?.id ? 'bg-brand-700 text-white' : 'bg-white text-gray-700'}`}
            >
              <ChainIcon chain={item?.name as any} />
              <p className="text-base font-semibold capitalize">{item?.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* layer 1 */}
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-sm font-semibold text-gray-500">Layer 1</p>
        <div className="flex flex-col gap-2">
          {l1ChainList.map((item) => (
            <div
              onClick={() => navigate(`/dashboard/accounts/1/${item?.id}`)}
              key={item?.id}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer item-sidebar
                ${chainId === item?.id ? 'bg-brand-700 text-white' : 'bg-white text-gray-700'}`}
            >
              <ChainIcon chain={item?.name as any} />
              <p className="text-base font-semibold capitalize">{item?.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bg-brand-50 border border-brand-500 p-4 flex items-start gap-3 bottom-0 left-0 rounded-xl m-4">
        <div className="flex">
          <div className="bg-brand-500 p-2.5 rounded-lg shadow-xs">
            <Icon
              icon="solar:info-circle-outline"
              className="text-white text-xs"
            />
          </div>
        </div>
        <div>
          <div className="text-gray-700 font-semibold text-xs">
            Important Notice: Testing Environment Only !
          </div>
          {/* <div className="text-gray-600 text-sm">
            This is a personal Superchain environment designed exclusively for
            testing and development.
          </div> */}
        </div>
      </div>
    </DashboardSidebarWrapper>
  );
}

export default DashboardSidebar;
