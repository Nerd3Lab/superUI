import styled from 'styled-components';
import LoadingDots from '../components/utility/LoadingDots';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChainSlide, useChainState } from '../states/chain/reducer';
import { ipcRenderer } from 'electron';
import { SupersimLog } from '../../main/services/supersimService';
import { IDMapchain } from '../../shared/constant/chain';
import { useAppDispatch } from '../states/hooks';

interface Props extends SimpleComponent {}

const ProjectLoadingWrapper = styled.div`
  .animate-trans {
    animation: moving 5s infinite;
  }

  @keyframes moving {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(360deg);
    }
    100% {
      transform: translateX(0deg);
    }
  }
`;

function ProjectLoading(props: Props) {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const chainState = useChainState();

  const startSupersim = async () => {
    await window.electron.supersim.startSupersim({
      mode: chainState.mode,
      name: chainState.name,
      l2: chainState.l2.map((chain) => IDMapchain[chain]),
    });
  };

  useEffect(() => {
    startSupersim();
    window.electron.ipcRenderer.on('supersim-log', (message) => {
      const {
        message: messageLog,
        loading,
        running,
        error,
      } = message as SupersimLog;
      setLogs((prevLogs: any) => [...prevLogs, messageLog]);
      dispatch(
        ChainSlide.actions.setStatus({
          loading,
          running,
          error,
        }),
      );
    });
  }, []);

  useEffect(() => {
    if (chainState.running) {
      navigate(`/dashboard/accounts/1/${chainState.l1[0]}`);
    }
  }, [chainState.running]);

  return (
    <ProjectLoadingWrapper className="w-full flex flex-col gap-3 items-center justify-center">
      <div className="flex flex-col gap-3 items-center justify-center">
        <div className="rounded-full w-30 h-30 relative overflow-hidden">
          <div className="bg-radiant w-full h-full animate-trans"></div>
        </div>
        <div className="flex flex-col items-center mt-4 gap-2">
          <div className="text-3xl font-semibold text-black flex gap-2">
            Just a moment <LoadingDots />
          </div>
          <p className="text-gray-600 text-base">We are building for you </p>
          <div className="max-w-full w-full break-all text-brand-400 text-center">
            {/* Creating... Opstack chain */}
            {logs[logs.length - 1] || ''}
          </div>
        </div>
      </div>
    </ProjectLoadingWrapper>
  );
}

export default ProjectLoading;
