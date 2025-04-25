import styled from 'styled-components';
import LoadingDots from '../components/utility/LoadingDots';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { anvilLog } from '../../main/services/foundryService';

interface Props extends SimpleComponent {}

const ProjectCheckingWrapper = styled.div`
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

function ProjectChecking(props: Props) {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(false);

  console.log(logs);

  const startCheckAnvil = async () => {
    await window.electron.foundry.check();
  };

  useEffect(() => {
    startCheckAnvil();
    window.electron.ipcRenderer.on('anvil-log', (message) => {
      const {
        message: messageLog,
        loading,
        running,
        error,
      } = message as anvilLog;
      setLogs((prevLogs: any) => [...prevLogs, messageLog]);
      setLoading(loading);
      setRunning(running);
      setError(error);
    });
  }, []);

  useEffect(() => {
    if (running) {
      navigate(`/project`);
    }
  }, [running]);
  return (
    <ProjectCheckingWrapper className="w-full flex flex-col gap-3 items-center justify-center">
      <div className="flex flex-col gap-3 items-center justify-center">
        <div className="rounded-full w-30 h-30 relative overflow-hidden">
          <div className="bg-radiant w-full h-full animate-trans"></div>
        </div>
        <div className="flex flex-col items-center mt-4 gap-2">
          <div className="text-3xl font-semibold text-black flex gap-2">
            Just a moment <LoadingDots />
          </div>
          <span className="text-sm text-gray-500">Checking foundry</span>
          <div className="max-w-full w-full break-all text-brand-400 text-center">
            {/* Creating... Opstack chain */}
            {logs[logs.length - 1] || ''}
          </div>
        </div>
      </div>
    </ProjectCheckingWrapper>
  );
}

export default ProjectChecking;
