import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AvailableForkChain, chainNameMap } from '../../shared/constant/chain';
import ButtonStyled from '../components/utility/ButtonStyled';
import ChainIcon from '../components/utility/ChainIcon';
import Input from '../components/utility/Input';
import { ChainSlide } from '../states/chain/reducer';
import { useAppDispatch } from '../states/hooks';
import { capitalizeFirstLetter } from '../utils/index';

interface Props extends SimpleComponent {}

const ProjectCreateWrapper = styled.div`
  /* hover */
  .project-item:hover {
    border-color: var(--color-brand-500);
  }
`;

function ProjectCreate(props: Props) {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<'quick' | 'fork'>('quick');
  const [selectForkChain, setSelectForkChain] = useState<string[]>([]);
  const [error, setError] = useState({ projectName: '', chain: '' });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectForkChainClick = (chain: string) => {
    if (selectForkChain.includes(chain)) {
      setSelectForkChain(selectForkChain.filter((c) => c !== chain));
    } else {
      setSelectForkChain([...selectForkChain, chain]);
    }
  };

  const onClickType = (newType: 'quick' | 'fork') => {
    if (newType === 'quick') {
      setType('quick');
      setSelectForkChain([]);
    } else {
      setType('fork');
    }
  };

  const submit = () => {
    setError({ projectName: '', chain: '' });

    if (name.trim() === '') {
      setError({ ...error, projectName: 'Project name is required.' });
      return;
    }

    if (type === 'fork' && selectForkChain.length === 0) {
      setError({
        ...error,
        chain: 'Please select at least one chain for fork mode.',
      });
      return;
    }

    if (type === 'quick') {
      dispatch(ChainSlide.actions.runQuickMode({ name }));
      navigate('/loading');
    } else {
      dispatch(
        ChainSlide.actions.runForkMode({ name, l2: selectForkChain as any }),
      );
      navigate('/loading');
    }
  };

  return (
    <ProjectCreateWrapper className="w-full flex flex-col gap-3">
      <Link to="/">
        <div className="text-brand-700 cursor-pointer flex items-center gap-2 hovering">
          <Icon icon="grommet-icons:form-previous-link" className="text-2xl" />
          <p className="text-sm font-semibold">Go back</p>
        </div>
      </Link>
      <div>
        <h1 className="text-gray-900 font-semibold text-2xl">
          Create New Project
        </h1>
        <span className="text-sm text-gray-600">
          Select your simulate chain
        </span>
      </div>
      <div className="w-full">
        <Input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
            if (error) setError({ projectName: '', chain: '' });
          }}
          placeholder="Project Name"
          error={error.projectName}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error.chain}</div>}

      <div className="bg-gray-200 h-[1px]"></div>
      <div
        onClick={() => onClickType('quick')}
        className={`border-2 bg-white flex items-start px-5 py-6 rounded-3xl gap-3 cursor-pointer transition-all project-item relative ${
          type === 'quick' ? 'border-brand-500' : 'border-gray-200'
        }`}
      >
        <div className="bg-gray-100 text-brand-500 flex items-center justify-center rounded-full p-2">
          <Icon icon="iconamoon:file-add-duotone" className="text-2xl" />
        </div>
        <div>
          <b className="font-semibold text-gray-700 text-[1.125rem]">
            Quick start
          </b>
          <p className="text-sm text-gray-600">
            Spin up a demo chain in seconds
          </p>
        </div>

        <div className="flex ml-auto items-center gap-1">
          <ChainIcon chain={'op'} size="md" />
          <ChainIcon chain={'op'} size="md" />
          <ChainIcon chain={'op'} size="md" />
          <Icon icon="ic:baseline-plus" className="text-gray-600 text-md" />
          <ChainIcon chain={'eth'} size="md" />
        </div>
      </div>

      <div
        onClick={() => onClickType('fork')}
        className={`border-2 bg-white px-5 py-6 rounded-3xl cursor-pointer transition-all project-item relative gap-3 flex flex-col ${
          type === 'fork' ? 'border-brand-500' : 'border-gray-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="bg-radiant text-brand-500 flex items-center justify-center rounded-full p-2">
            <Icon
              icon="meteor-icons:sparkles"
              className="text-2xl text-white"
            />
          </div>
          <div>
            <b className="font-semibold text-gray-700 text-[1.125rem]">
              Fork mode
            </b>
            <p className="text-sm text-gray-600">
              Clone an existing chain from the Superchain registry
            </p>
          </div>

          <div className="flex ml-auto items-center gap-1 absolute top-3 right-3">
            {selectForkChain.map((chain) => (
              <ChainIcon
                key={`chain-l2-${chain}`}
                chain={chain as any}
                size="md"
              />
            ))}
            {selectForkChain.length > 0 && (
              <Icon icon="ic:baseline-plus" className="text-gray-600 text-md" />
            )}
            {selectForkChain.length > 0 && (
              <ChainIcon chain={'eth'} size="md" />
            )}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {AvailableForkChain.map((chain) => (
            <div
              onClick={() => selectForkChainClick(chain as any)}
              key={`select-chain-${chain}`}
              className={`project-item w-[8.5rem] border-1 rounded-xl py-2 flex items-center justify-start pl-4 gap-2 text-black text-sm font-semibold border-gray-300 transition-all ${
                selectForkChain.includes(chain) ? 'bg-brand-50' : 'bg-white'
              }`}
            >
              <ChainIcon chain={chain as any} size={'md'} />
              <span className='text-sm'>{chainNameMap[chain] || capitalizeFirstLetter(chain)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <ButtonStyled onClick={submit}>Create project →</ButtonStyled>
      </div>
    </ProjectCreateWrapper>
  );
}

export default ProjectCreate;
