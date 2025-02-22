import { Icon } from '@iconify/react';
import { ProgressInfo } from 'electron-updater';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props extends SimpleComponent {}

const UpdateLoadingWrapper = styled.div``;

function UpdateLoading(props: Props) {
  const [percent, setPercent] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const radius = 45;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (percent / 100) * circumference;

  useEffect(() => {
    window.electron.ipcRenderer.on('download-progress', (message) => {
      const { percent } = message as ProgressInfo;
      setPercent(percent);

      if (!isUpdate && percent > 0 && percent < 100) {
        setIsUpdate(true);
      }

      if (percent === 100) {
        setIsUpdate(false);
      }
    });
  }, []);

  if (!isUpdate) {
    return null;
  }

  return (
    <UpdateLoadingWrapper className="z-200 bg-gray-100 fixed w-12 h-12 rounded-full left-2 bottom-12 flex items-center justify-center animate-bounce">
      <div className="flex flex-col items-center justify-center relative">
        <Icon
          icon="material-symbols-light:deployed-code-update"
          className="text-brand-400 text-xl"
        />
        <svg
          width="30"
          height="30"
          viewBox="0 0 100 100"
          className="rotate-[-90deg] absolute"
        >
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-gray-300 fill-none"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="stroke-blue-500 fill-none transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </UpdateLoadingWrapper>
  );
}

export default UpdateLoading;
