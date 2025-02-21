import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { typeChainID } from '../../shared/constant/chain';
import { useChainState } from '../states/chain/reducer';
import { useCurrentChainParams } from '../hooks/useCurrentChainParams';

interface Props extends SimpleComponent {}

const DashboardLogsRouteWrapper = styled.div``;

const getLogLevel = (log: string) => {
  if (/error|failed|critical/i.test(log)) return 'error';
  if (/warn|warning/i.test(log)) return 'warning';
  if (/info|success|started/i.test(log)) return 'info';
  return 'default';
};

function DashboardLogsRoute(props: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const chainState = useChainState();
  const { chainId } = useCurrentChainParams();

  const subscribeToLogs = async () => {
    // Call subscribe from main process
    const chain = chainState.chainConfing[chainId];
    const file = chainState?.chainLogsPath?.[chainId];
    if (!chain || !file) return;
    await window.electron.log.subscribe({ chain, file });
  };

  useEffect(() => {
    // window.electron.ipcRenderer.off('log-update', (_event, log) => {});
    subscribeToLogs();

    window.electron.ipcRenderer.on('log-update', (log) => {
      console.log('log-update', log);
      const logs = log as any;
      const logsString = logs.msg as string;
      setLogs((prevLogs) => [...prevLogs, logsString]);

      // Auto-scroll to the latest log
      setTimeout(() => {
        logContainerRef.current?.scrollTo({
          top: logContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 50);
    });

    return () => {
      window.electron.log.unsubscribe();
      window.electron.ipcRenderer.off('log-update', (_event, log) => {});
    };
  }, [chainId]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-full mx-auto">
      <h2 className="text-lg font-bold text-blue-400">Live Logs</h2>
      <div
        className="h-96 overflow-auto border border-gray-700 p-2 mt-2 rounded"
        ref={logContainerRef}
      >
        {logs.map((log, index) => {
          const level = getLogLevel(log);
          return (
            <div
              key={index}
              className="flex gap-2 p-1 border-b border-gray-700 items-start text-sm"
            >
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  level === 'error'
                    ? 'bg-red-600 text-white'
                    : level === 'warning'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-blue-500 text-white'
                }`}
              >
                {level.toUpperCase()}
              </span>
              <span className="whitespace-pre-wrap">{log}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardLogsRoute;
