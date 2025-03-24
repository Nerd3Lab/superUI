import styled from 'styled-components';
import BaseIMG from '../../../../assets/img/crypto/base.svg';
import ETHIMG from '../../../../assets/img/crypto/eth.svg';
import LOCALIMG from '../../../../assets/img/crypto/local.svg';
import MODEIMG from '../../../../assets/img/crypto/mode.svg';
import OPIMG from '../../../../assets/img/crypto/op.svg';
import ZoraIMG from '../../../../assets/img/crypto/zora.svg';
import AccountIMG from '../../../../assets/img/crypto/account.svg';
import LyraIMG from '../../../../assets/img/crypto/lyra.jpg';
import MetalIMG from '../../../../assets/img/crypto/metal.png';
import OrderlyIMG from '../../../../assets/img/crypto/orderly.jpg';
import RaceIMG from '../../../../assets/img/crypto/race.jpg';
import TBNIMG from '../../../../assets/img/crypto/tbn.png';
import UNICHAIN from '../../../../assets/img/crypto/unichain.png';
import CYBERIMG from '../../../../assets/img/crypto/cyber.png';

const IconsDict : any = {
  base: BaseIMG,
  eth: ETHIMG,
  local: LOCALIMG,
  mode: MODEIMG,
  op: OPIMG,
  zora: ZoraIMG,
  account: AccountIMG,
  lyra: LyraIMG,
  metal: MetalIMG,
  orderly: OrderlyIMG,
  race: RaceIMG,
  tbn: TBNIMG,
  OPChainA: OPIMG,
  OPChainB: OPIMG,
  mainnet: ETHIMG,
  unichain: UNICHAIN,
  cyber: CYBERIMG,
};

export type ChainListIcon = keyof typeof IconsDict;

interface Props extends SimpleComponent {
  chain: any;
  size?: 'md' | 'lg' | 'xl';
}

const ChainIconWrapper = styled.div``;

function ChainIcon(props: Props) {
  const classname = `${props.size === 'md' ? 'w-7 h-7' : props.size === 'lg' ? 'w-10 h-10' : props.size === 'xl' ? 'w-32 h-32' : 'w-7 h-7'}
  rounded-full flex items-center p-1 justify-center ${props.chain === 'tbn' ? 'bg-black' : 'bg-white'}`;

  if (!IconsDict[props.chain]) {
    return <></>;
  }
  return (
    <ChainIconWrapper className={classname}>
      <img
        src={IconsDict[props.chain]}
        alt={props.chain}
        className="w-full h-full object-contain rounded-full"
      />
    </ChainIconWrapper>
  );
}

export default ChainIcon;
