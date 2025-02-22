import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from './DashboardLayout';
import MainLayout from './MainLayout';
import PesticideButton from '../utility/PesticideButton';
import UpdateLoading from './UpdateLoading';

interface Props extends SimpleComponent {
  children: React.ReactNode;
}

const LayoutWrapper = styled.div``;

const isDev = process.env.NODE_ENV === 'development';

const PestisideButtonContainer = () => {
  if (!isDev) {
    return null;
  }
  return (
    <div className="fixed bottom-2 right-1 z-200">
      <PesticideButton />
    </div>
  );
};

function Layout(props: Props) {
  const route = useLocation();
  useEffect(() => {
    scrollTo(0, 0);
  }, [route]);

  if (route.pathname.includes('dashboard')) {
    return (
      <LayoutWrapper className="w-full h-full relative bg-white">
        <UpdateLoading />
        <PestisideButtonContainer />
        <DashboardLayout>{props.children}</DashboardLayout>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper className="w-full h-full relative bg-white">
      <UpdateLoading />
      <PestisideButtonContainer />
      <MainLayout>{props.children}</MainLayout>
    </LayoutWrapper>
  );
}

export default Layout;
