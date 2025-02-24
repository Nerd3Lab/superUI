import styled from 'styled-components';
import cryptoIMGSVG from '../../../../assets/img/cryptogroup.svg';

interface Props extends SimpleComponent {}

const ChainBallWrapper = styled.div``;

function ChainBall(props: Props) {
  return (
    <div className="w-full overflow-hidden absolute top-0 left-0 rounded-[20px]">
      <ChainBallWrapper className="w-[110%]  -translate-x-5">
        <img
          src={cryptoIMGSVG}
          alt="Crypto Group"
          className="w-full object-contain"
        />
      </ChainBallWrapper>
    </div>
  );
}

export default ChainBall;
