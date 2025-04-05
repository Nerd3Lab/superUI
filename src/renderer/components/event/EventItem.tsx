import styled from 'styled-components';
import { LoggingType } from '../../../main/services/transactionService';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { SplitAddress } from '../../utils/index';
import { useTimeFromBlockNumber } from '../../hooks/useTimeFromBlockNumber';
import { useCurrentChainParams } from '../../hooks/useCurrentChainParams';
import { useChainState } from '../../states/chain/reducer';
import { useContractState } from '../../states/contract/reducer';
import CopyText from '../utility/CopyText';
import { useEffect, useState } from 'react';
import {
  decodeEvent,
  decodeEventType,
} from '../../../shared/utils/decodeEvent';
import { useAppDispatch } from '../../states/hooks';
import Modal from '../utility/Modal';
import EventModal from './EventModal';
import { openModal } from '../../states/modal/reducer';

interface Props extends SimpleComponent {
  event: LoggingType;
}

const EventItemWrapper = styled.tr`
  .hover-text {
    &:hover {
      color: red;
    }
  }
`;

function EventItem({ event }: Props) {
  const chainState = useChainState();
  const { chainId, layer } = useCurrentChainParams();
  const chain = chainState.chainConfing[chainId];
  const time = useTimeFromBlockNumber(chain, event.blockNumber);
  const [decode, setDecode] = useState<decodeEventType>();

  const contractState = useContractState();
  const contract = contractState.items[chainId]?.find(
    (c) => c.contractAddress === event.address,
  );
  const abiContract = contract?.abi;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onClickContract = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/dashboard/contracts/${layer}/${chainId}/${event.address}`);
  };

  useEffect(() => {
    const decodeEventLog = async () => {
      if (!abiContract) return;
      try {
        const decodedEvent = decodeEvent(event, abiContract);
        if (decodedEvent) {
          setDecode(decodedEvent);
        }
      } catch (error) {
        console.error('Error decoding event:', error);
        setDecode(undefined);
      }
    };

    decodeEventLog();
  }, [abiContract, event]);

  const openModalEvent = () => {
    dispatch(openModal('eventModal'));
  };

  return (
    <>
      <Modal modalId={'eventModal'}>
        <EventModal event={event} decode={decode} time={time} contract={contract}/>
      </Modal>
      <EventItemWrapper className="border-b-1 border-gray-200">
        <td className="text-left py-4">
          <div
            className={`${decode?.eventName ? 'text-gray-600' : 'text-brand-400'} text-sm`}
          >
            {decode?.eventName || 'Invalid ABI'}
          </div>
        </td>
        <td className="text-left py-4">
          <div className="text-gray-600 text-sm">{event.blockNumber}</div>
        </td>
        <td className="text-left py-4">
          <div className="text-gray-600 text-sm">{time.format}</div>
        </td>
        <td className="text-left py-4 flex flex-col items-start">
          <div className="text-emerald-500 text-sm">
            Contract Name : {contract?.name || '-'}
          </div>
          <div
            onClick={onClickContract}
            className="text-gray-600 text-sm flex items-center gap-1 hover-text"
          >
            {SplitAddress(event.address)} <CopyText value={event.address} />
          </div>
        </td>
        <td className="text-left py-4">
          <div className="text-gray-600 text-sm flex items-center gap-1">
            {SplitAddress(event.transactionHash)}{' '}
            <CopyText value={event.transactionHash} />
          </div>
        </td>
        <td className="text-left">
          <div
            className="flex items-center text-gray-400 hover-text cursor-pointer"
            onClick={openModalEvent}
          >
            <Icon icon="mdi:eye" className="cursor-pointer text-2xl" />
          </div>
        </td>
      </EventItemWrapper>
    </>
  );
}

export default EventItem;
