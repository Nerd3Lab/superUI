import styled from 'styled-components';
import { decodeEventType } from '../../../shared/utils/decodeEvent';
import { LoggingType } from '../../../main/services/transactionService';
import { SplitAddress } from '../../utils/index';
import CopyText from '../utility/CopyText';
import { ContractItemType } from '../../states/contract/reducer';
import { Icon } from '@iconify/react';

interface Props extends SimpleComponent {
  decode?: decodeEventType;
  event: LoggingType;
  time: any;
  contract?: ContractItemType;
}

const EventModalWrapper = styled.div``;

function EventModal({ event, decode, time, contract }: Props) {
  console.log({ decode });
  const decodedList = decode ? Object.entries(decode.args) : [];

  const abi = contract?.abi?.find((e) => e.name === decode?.eventName);
  return (
    <EventModalWrapper className="w-auto max-h-[80vh] max-w-[80vw] overflow-auto">
      <div className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-gray-900">Event Detail</div>

        <div className="flex flex-col gap-1">
          <div className="flex gap-1 text-base">
            <div className="font-semibold">Event Name: </div>
            <div
              className={`${decode?.eventName ? 'text-gray-600' : 'text-brand-400'}`}
            >
              {' '}
              {decode?.eventName || 'Invalid ABI'}
            </div>
          </div>

          <div className="flex gap-1 text-base">
            <div className="font-semibold">Block Number: </div>
            <div> {event.blockNumber}</div>
          </div>

          <div className="flex gap-1 text-base">
            <div className="font-semibold">Timestamp: </div>
            <div> {time.format}</div>
          </div>

          <div className="flex gap-1 text-base">
            <div className="font-semibold">Contract Name: </div>
            <div> {contract?.name || '-'}</div>
          </div>

          <div className="flex gap-1 text-base">
            <div className="font-semibold">Contract Address: </div>
            <div className="flex items-center gap-1">
              {' '}
              {SplitAddress(event.address)} <CopyText value={event.address} />
            </div>
          </div>

          <div className="flex gap-1 text-base">
            <div className="font-semibold">Transaction Hash: </div>
            <div className="flex items-center gap-1">
              {SplitAddress(event.transactionHash)}{' '}
              <CopyText value={event.transactionHash} />
            </div>
          </div>
        </div>

        <div className="font-semibold flex items-center text-lg gap-1">
          <Icon icon={'icon-park-outline:log'} />
          Logs
        </div>

        <div className="">
          <div className="flex flex-col gap-1">
            {event.topics.map((topic, i) => {
              return (
                <div key={`topic-${i}`}>
                  [topic{i}] - {topic}
                </div>
              );
            })}
          </div>
        </div>
        {decode && (
          <div className="">
            <div className="font-semibold text-base">Decoded: </div>
            <div className="flex flex-col gap-1">
              {decodedList.map((log, i) => {
                return (
                  <div key={`log-${i}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-300">
                        {abi?.inputs?.[i]?.type}
                      </span>
                      {log[0].toString()}
                    </div>
                    {log[1].toString()}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </EventModalWrapper>
  );
}

export default EventModal;
