import { Icon } from '@iconify/react';
import { useState } from 'react';
import styled from 'styled-components';
import LOGO_IMG from '../../../../assets/img/logo.svg';
import Carousel from '../utility/Carousel';
import ChainBall from './ChainBall';

interface Props extends SimpleComponent {
  children: React.ReactNode;
}

const MainLayoutWrapper = styled.div``;

function MainLayout(props: Props) {
  const [version, setVersion] = useState<string>('');
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [ready, setReady] = useState<boolean>(false);

  console.log('updateInfo', updateInfo);

  // const getVersion = async () => {
  //   window.electron.app.getCurrentVersion().then((version) => {
  //     setVersion(version.currentVersion);
  //     setUpdateInfo(version.updateInfo);
  //   });
  // };

  // const downloadVersion = async () => {
  //   await window.electron.app.startUpdate().then(() => {
  //     console.log('Update started');
  //   });
  // };

  // const quitAndInstall = async () => {
  //   await window.electron.app.updateDownloaded().then(() => {
  //     console.log('Update installed');
  //   });
  // };

  // useEffect(() => {
  //   getVersion();

  //   window.electron.ipcRenderer.on('update-downloaded', (val) => {
  //     setReady(true);
  //     quitAndInstall();
  //   });
  // }, []);

  return (
    <MainLayoutWrapper className="w-full h-full grid grid-cols-2">
      <div className="bg-gray-50 w-full h-full relative z-100 p-10 flex flex-col justify-center">
        <div className="absolute left-6 top-6">
          <img src={LOGO_IMG} alt="logo" className="h-12" />
        </div>
        {/* <div className="bg-white absolute right-6 top-6 flex items-center">
          VERSION : {version}

          {updateInfo && (
            <button
              onClick={downloadVersion}
              className="bg-brand-500 text-white px-2 py-1 ml-2"
            >
              Update
            </button>
          )}
        </div> */}
        <div className="">{props.children}</div>
        <p className="absolute bottom-6 left-6 text-gray-600 text-sm">
          © Nerd3Lab 2025
        </p>
        <p className="flex items-center absolute bottom-6 right-6 text-gray-600 text-sm">
          <Icon
            icon="akar-icons:email"
            className="text-brand-500 text-lg mr-2"
          />
          nerd3lab@gmail.com
        </p>
      </div>
      <div className="py-4 pr-4 flex bg-gray-50">
        <div className="w-full flex flex-col justify-end relative items-center bg-white rounded-[20px]">
          <img src="/img/bg-pattern.png" alt="" className="absolute h-full" />
          <ChainBall />
          <div className="w-full px-4 mb-36">
            <Carousel
              auto={true}
              items={[
                <div className="text-5xl text-black font-semibold text-center">
                  Built on Ethereum,{' '}
                  <span className="text-brand-500">
                    built on the Superchain.
                  </span>
                </div>,
                <div className="text-5xl text-black font-semibold text-center">
                  NERD BUILD
                  <span className="text-brand-500"> WEB3</span>
                </div>,
                <div className="text-5xl text-black font-semibold text-center">
                  Quickly fire up a personal{' '}
                  <span className="text-brand-500">Superchain blockchain</span>
                </div>,
              ]}
            />
          </div>
        </div>
      </div>
    </MainLayoutWrapper>
  );
}

export default MainLayout;
