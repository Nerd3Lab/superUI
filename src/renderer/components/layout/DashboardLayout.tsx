import styled from 'styled-components';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

interface Props extends SimpleComponent {
  children: React.ReactNode;
}

const DashboardLayoutWrapper = styled.div``;

function DashboardLayout(props: Props) {
  return (
    <DashboardLayoutWrapper className="w-full h-full max-w-full flex flex-wrap p-2 bg-white relative">
      <DashboardHeader />
      <DashboardSidebar />

      <div className="pl-[16rem] pt-[6.5rem] grow">
        <div
          className="py-5 px-6 h-full bg-white"
          // style={{ height: 'calc(100vh - 10rem)' }}
        >
          {props.children}
        </div>
      </div>
    </DashboardLayoutWrapper>
  );
}

export default DashboardLayout;
