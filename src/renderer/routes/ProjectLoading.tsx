import styled from 'styled-components';
import LoadingDots from '../components/utility/LoadingDots';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChainSlide, useChainState } from '../states/chain/reducer';
import { ipcRenderer } from 'electron';
import { SupersimLog } from '../../main/services/supersimService';
import { IDMapchain } from '../../shared/constant/chain';
import { useAppDispatch } from '../states/hooks';
import { Icon } from '@iconify/react';
import { addContractItem } from '../states/contract/reducer';
import { AbiL1, AbiPredeploy } from '../../shared/abi/index';
import { predeployAddress } from '../../shared/constant/predeployAddress';

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
        chainLogsPath,
        contracts,
      } = message as SupersimLog;
      setLogs((prevLogs: any) => [...prevLogs, messageLog]);
      dispatch(
        ChainSlide.actions.setStatus({
          loading,
          running,
          error,
          chainLogsPath,
        }),
      );

      if (contracts) {
        const l1Chain = chainState.l1[0];
        for (const contract of contracts) {
          const toChain = chainState.chainConfing[contract.chainId];
          const name = `${contract.name} - ${toChain?.name}`;
          dispatch(
            addContractItem({
              chainId: l1Chain,
              contract: {
                contractAddress: contract.address,
                name: name,
                contractName: contract.name,
                abi: AbiL1[contract.name] || undefined,
                createdAtBlockNumber: undefined,
              },
            }),
          );
        }

        const preDeployList = Object.entries(AbiPredeploy);
        for (const [name, abi] of preDeployList) {
          for (const l2Chain of chainState.l2) {
            const contract = {
              chainId: l2Chain,
              contract: {
                contractAddress: predeployAddress[name], // Placeholder address
                name: `${name} - Predeploy`,
                contractName: name,
                abi: abi as any,
                createdAtBlockNumber: '0',
                isPredeploy: true,
              },
            };
            console.log({ contract });
            dispatch(addContractItem(contract));
          }
        }
      }
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

          <div>
            {chainState.error && (
              <Link
                to="/"
                className="text-warning-500 text-lg flex items-center gap-2"
              >
                <Icon icon="mdi:home" className="text-lg" /> Back to home
              </Link>
            )}
          </div>
        </div>
      </div>
    </ProjectLoadingWrapper>
  );
}

export default ProjectLoading;
