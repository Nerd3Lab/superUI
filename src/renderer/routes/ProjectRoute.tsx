import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ButtonStyled from '../components/utility/ButtonStyled';
import SerchBox from '../components/utility/SearchBox';

interface Props extends SimpleComponent {}

const ProjectRouteWrapper = styled.div``;

function ProjectRoute(props: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };
  return (
    <ProjectRouteWrapper className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-black font-semibold text-2xl">All Project</h2>
        <ButtonStyled onClick={() => navigate('/create')}>
          <div className="flex items-center gap-2">
            <Icon icon={'ei:plus'} className="text-2xl" />
            Create Project
          </div>
        </ButtonStyled>
      </div>
      <p className="text-gray-600">Recent Projects</p>
      <SerchBox value={search} onChange={handleChange} />
      <div className="flex flex-col gap-2 w-full max-h-[50vh] overflow-scroll">
        <div className="w-full cursor-pointer rounded-xl flex gap-4 border-1 border-brand-500 bg-brand-50 p-4">
          <div>
            <div className="bg-brand-500 p-2.5 rounded-lg shadow-xs">
              <Icon icon="solar:info-circle-outline" className="text-white" />
            </div>
          </div>
          <div>
            <div className="text-gray-700 text-md font-semibold">
              Alpha Version Notice
            </div>
            <div className="text-gray-600 text-md">
              Please note that any data or progress may be lost after closing
              the session.
            </div>
          </div>
        </div>
        {/* <Projectitem
          name="Nerd3Lab"
          description="deploying blockchain applications."
          l2ChainList={['base', 'eth', 'local', 'mode', 'op', 'zora']}
          l1ChainList={['eth']}
          status={'active'}
        /> */}
        {/* <Projectitem
          name='ETH lab'
          description='when eth up'
          l2ChainList={['eth', 'op', 'zora']}
          l1ChainList={['eth']}
          status={'inactive'}
        /> */}
      </div>
    </ProjectRouteWrapper>
  );
}

export default ProjectRoute;
