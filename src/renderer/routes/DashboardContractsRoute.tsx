import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import AVATARIMG from '../../../assets/img/avatar.png';
import ETHIMG from '../../../assets/img/ETH.png';
import ButtonStyled from '../components/utility/ButtonStyled';
import ChainIcon from '../components/utility/ChainIcon';
import Input from '../components/utility/Input';
import Radio from '../components/utility/Radio';
import Select from '../components/utility/SelectOption';
import Stepper from './ContractsStep';

interface Props extends SimpleComponent {}

const ContractsRouteWrapper = styled.div``;

const options = [
  { value: 'hardhat', label: 'Hardhat', imgSrc: '/icons/hardhat.svg' },
  { value: 'truffle', label: 'Truffle', imgSrc: '/icons/truffle.svg' },
];

interface Network {
  name: string;
  image: string;
  layer: number;
  chain: 'base' | 'zora' | 'op' | 'lyra' | 'mode' | 'mainnet';
}

const networks: Network[] = [
  { name: 'BASE', image: '/icons/base.png', layer: 2, chain: 'base' },
  { name: 'Zora', image: '/icons/zora.png', layer: 2, chain: 'zora' },
  { name: 'OP Chain', image: '/icons/opchain.png', layer: 2, chain: 'op' },
  { name: 'Lyra L2', image: '/icons/lyra.png', layer: 2, chain: 'lyra' },
  { name: 'Mode', image: '/icons/mode.png', layer: 2, chain: 'mode' },
  { name: 'Soneium', image: '/icons/soneium.png', layer: 2, chain: 'base' },
];

function DashboardContractsRoute(props: Props) {
  const [selected, setSelected] = useState(options[0]);
  const [directory, setDirectory] = useState('');
  const [selectedRadio, setSelectedRadio] = useState<string>('autoload');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string[]>([
    'Zora',
    'Mode',
    'Ethereum (Layer 1)',
  ]);
  const handleOpenDirectory = async () => {
    try {
      const win = window as any;
      if (win.showDirectoryPicker) {
        const dirHandle = await win.showDirectoryPicker();
        setDirectory(dirHandle.name);
      } else {
        alert('Directory Picker API is not supported in this browser.');
      }
    } catch (error) {
      console.error('Directory selection canceled');
    }
  };

  const toggleSelection = (networkName: string) => {
    setSelectedChain((prev) =>
      prev.includes(networkName)
        ? prev.filter((n) => n !== networkName)
        : [...prev, networkName],
    );
  };

  const handleSelection = (option: {
    value: string;
    label: string;
    imgSrc?: string;
  }) => {
    console.log('Selected:', option);
  };

  return (
    <ContractsRouteWrapper className="p-3">
      <div className="flex gap-1.5 items-center text-brand-700 mb-6 cursor-pointer">
        <Icon icon="grommet-icons:form-previous-link" className="text-2xl" />
        <div className="text-sm font-semibold">Back to contracts list</div>
      </div>
      <div className="flex gap-6">
        <div className="w-3/4 overflow-scroll max-full-screen">
          <div className="mb-5">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              Deploy contract
            </div>
            <div className="text-gray-600">
              Deploy your contract to Superchain with one click
            </div>
          </div>
          <div className="p-4 border rounded-xl bg-[#E8EBEF] border-[#18365C] flex flex-col gap-3">
            <div>
              <div className="text-gray-900 text-lg font-semibold">
                Developer Setting
              </div>
              <div className="text-gray-600 text-sm">
                Configure your contract's development environment
              </div>
            </div>
            <div className="flex gap-8 items-center">
              <div className="w-2/4">
                <div className="text-sm font-semibold text-gray-700">Mode</div>
                <div className="text-sm text-gray-600">
                  Select your development environment
                </div>
              </div>
              <div className="w-2/4">
                <Select options={options} onSelect={handleSelection} />
              </div>
            </div>
            <div className="flex gap-8 items-center">
              <div className="w-2/4">
                <div className="text-sm font-semibold text-gray-700">
                  Source directory
                </div>
              </div>
              <div className="w-2/4">
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    value={directory || 'Select a directory...'}
                    readOnly
                    className="flex-1 text-gray-500 truncate border border-gray-300 px-3.5 py-2.5 rounded-l-lg bg-white border-r-0"
                  />
                  <button
                    onClick={handleOpenDirectory}
                    className="text-gray-700 font-medium hover:bg-gray-200 border border-gray-300 px-3.5 py-2.5 rounded-r-lg bg-white"
                  >
                    Open Directory
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <ButtonStyled>Save setting</ButtonStyled>
            </div>
          </div>
          <div className="mt-4 flex gap-8">
            <div className="w-64">
              <div className="text-gray-900 text-sm font-semibold">
                Upload ABI <span className="text-red-600">*</span>
              </div>
              <div className="text-gray-600 text-sm">
                Choose an ABI file manually or auto-load
              </div>
            </div>
            <div className="w-full">
              <Radio
                name="abiSource"
                label="Use source from settings (Autoload ABI from project directory)"
                description="/Users/poonpetchx/Test Deploy/ABI/"
                checked={selectedRadio === 'autoload'}
                onChange={() => setSelectedRadio('autoload')}
              />
              <Select
                options={[
                  {
                    value: 'Contract name 1.json',
                    label: 'Contract name 1.json',
                  },
                ]}
                label="Select Contract"
                required
                className="mt-2"
              />
              <div className="mt-4">
                <Radio
                  name="abiSource"
                  label="Manual upload (Upload ABI file manually)"
                  description="Select or drop your ABI file here"
                  checked={selectedRadio === 'manual'}
                  onChange={() => setSelectedRadio('manual')}
                />
                <div className="flex gap-8 items-center">
                  <div className="flex items-center w-full">
                    <div className="mt-2 w-full">
                      <label className="block text-gray-700 font-medium mb-1 text-sm">
                        Upload ABI
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex justify-center w-full">
                        <input
                          type="text"
                          value={directory || 'Your ABI'}
                          readOnly
                          className="flex-1 text-gray-500 truncate border border-gray-300 px-3.5 py-2.5 rounded-l-lg bg-white border-r-0"
                        />
                        <button
                          onClick={handleOpenDirectory}
                          className="text-gray-700 font-medium hover:bg-gray-200 border border-gray-300 px-3.5 py-2.5 rounded-r-lg bg-white"
                        >
                          <div className="flex">
                            <Icon
                              icon="material-symbols:upload-rounded"
                              className="w-5 h-5"
                            />
                            Upload
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-3 border-gray-200" />
          <div className="flex gap-8">
            <div className="w-64">
              <div className="text-gray-900 text-sm font-semibold">
                Contract name <span className="text-red-600">*</span>
              </div>
            </div>
            <Input
              value=""
              onChange={() => {}}
              placeholder="Type your contract name"
              className="w-full"
            />
          </div>
          <hr className="my-3 border-gray-200" />
          <div className="flex gap-8">
            <div className="w-64">
              <div className="text-gray-900 text-sm font-semibold">
                Argument <span className="text-red-600">*</span>
              </div>
              <div className="text-gray-600 text-sm">
                Set contract parameter
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <div className="flex gap-3 items-center w-full">
                <button className="flex w-32 text-sm justify-center items-center space-x-1 px-3 py-1 rounded-full border border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2] font-medium">
                  <Icon
                    icon="material-symbols:code"
                    className="text-lg text-[#0BA5EC]"
                  />
                  <span>String</span>
                </button>

                <div className="h-full bg-gray-200 w-[1px]" />
                <Input
                  value=""
                  onChange={() => {}}
                  placeholder="parameter"
                  className="w-full"
                />
              </div>
              <div className="flex gap-3 items-center w-full">
                <button className="flex w-32 text-sm justify-center items-center space-x-1 px-3 py-1 rounded-full border border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2] font-medium">
                  <Icon
                    icon="material-symbols:code"
                    className="text-lg text-[#0BA5EC]"
                  />
                  <span>Boolean</span>
                </button>

                <div className="h-full bg-gray-200 w-[1px]" />
                <div className="flex gap-6 w-full">
                  <Radio
                    checked={true}
                    label="TRUE"
                    name="argumentBoolean"
                    onChange={() => {}}
                  />
                  <Radio
                    checked={false}
                    label="FALSE"
                    name="argumentBoolean"
                    onChange={() => {}}
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center w-full">
                <button className="flex w-32 text-sm justify-center items-center space-x-1 px-3 py-1 rounded-full border border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2] font-medium">
                  <Icon
                    icon="material-symbols:code"
                    className="text-lg text-[#0BA5EC]"
                  />
                  <span>String</span>
                </button>

                <div className="h-full bg-gray-200 w-[1px]" />
                <Input
                  value=""
                  onChange={() => {}}
                  placeholder="parameter"
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <hr className="my-3 border-gray-200" />
          <div className="flex gap-8">
            <div className="w-64">
              <div className="text-gray-900 text-sm font-semibold">
                Deployer Address <span className="text-red-600">*</span>
              </div>
            </div>
            <div className="w-full relative" ref={dropdownRef}>
              {/* Account Box */}
              <div
                className="border border-gray-300 rounded-lg py-2.5 px-3.5 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={AVATARIMG}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-gray-900 font-medium">Account1</div>
                      <div className="text-gray-600 text-sm">
                        0xwadawadwadawdawdd
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-gray-900 font-medium">100 ETH</div>
                    <Icon
                      icon="akar-icons:chevron-down"
                      className="text-gray-500"
                    />
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className="absolute w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-2 z-10 transition-all px-4 py-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={AVATARIMG}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="text-gray-900 font-medium">
                          Account1
                        </div>
                        <div className="text-gray-600 text-sm">
                          0xwadawadwadawdawdd
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-gray-900 font-medium">100 ETH</div>
                      <Icon
                        icon="akar-icons:chevron-down"
                        className="text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className="my-3 border-gray-200" />
          <div className="flex gap-8">
            <div className="w-64">
              <div className="text-gray-900 text-sm font-semibold">
                Value <span className="text-red-600">*</span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-2/4 flex gap-2 items-center border border-gray-300 border-r-0 rounded-l-xl p-3.5 py-2.5">
                <input
                  type="number"
                  className="border-0 outline-none placeholder-gray-300 text-gray-800 flex-1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="w-2/4 p-3.5 py-2.5 border-l-0 border border-gray-300 rounded-r-xl flex items-center justify-end gap-3">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 text-xs">
                    50%
                  </div>
                  <div className="px-2 py-0.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 text-xs">
                    All
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src={ETHIMG}
                    alt="ETH"
                    className="w-5 h-5 rounded-full"
                  />
                  <div className="text-gray-700">ETH</div>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-3 border-gray-200" />
          <div className="flex gap-8">
            <div className="w-64">
              <div className="text-gray-900 text-sm font-semibold">
                Select chain <span className="text-red-600">*</span>
              </div>
              <div className="text-gray-600 text-sm">
                Choose the target network for deployment
              </div>
            </div>
            <div className="border-2 border-[#E5012C] rounded-[20px] p-5 bg-white w-full">
              {/* Layer 2 */}
              <div>
                <h3 className="text-gray-700 font-semibold mb-3 text-xs">
                  Layer 2
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {networks
                    .filter((n) => n.layer === 2)
                    .map((network) => (
                      <button
                        key={network.name}
                        onClick={() => toggleSelection(network.name)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer ${
                          selectedChain.includes(network.name)
                            ? 'border-brand-200 bg-brand-50'
                            : 'border-[#E4E7EC] bg-white'
                        }`}
                      >
                        <ChainIcon chain={network.chain} className="w-6 h-6" />

                        <span className="text-gray-800 font-medium">
                          {network.name}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
              <hr className="my-3 border-gray-200" />
              {/* Layer 1 */}
              <div>
                <h3 className="text-gray-700 font-semibold mb-3 text-xs">
                  Layer 1
                </h3>
                <button
                  onClick={() => toggleSelection('Ethereum (Layer 1)')}
                  className={`flex justify-center items-center gap-2 p-4 rounded-lg w-full border transition-all cursor-pointer ${
                    selectedChain.includes('Ethereum (Layer 1)')
                      ? 'border-brand-200 bg-brand-50'
                      : 'border-[#E4E7EC] bg-white'
                  }`}
                >
                  <ChainIcon chain="eth" />
                  <span className="text-gray-800 font-medium">
                    Ethereum (Layer 1)
                  </span>
                </button>
              </div>
            </div>
          </div>
          <hr className="my-3 border-gray-200" />
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-semibold">Go back</div>
            <ButtonStyled>Deploy contract</ButtonStyled>
          </div>
        </div>
        <div className="w-1/4">
          <Stepper />
        </div>
      </div>
    </ContractsRouteWrapper>
  );
}

export default DashboardContractsRoute;
