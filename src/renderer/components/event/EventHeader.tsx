import styled from 'styled-components';

interface Props extends SimpleComponent {}

const EventHeaderWrapper = styled.div``;

function EventHeader(props: Props) {
  return (
    <thead>
      <tr className="border-b-1 border-gray-200 text-gray-500 font-semibold">
        <th className="text-left py-3 text-xs">EVENT NAME</th>
        <th className="text-left py-3 text-xs">BLOCKNUMBER</th>
        <th className="text-left py-3 text-xs">TIMESTAMP</th>
        <th className="text-left py-3 text-xs">Contract ADDRESS</th>
        <th className="text-left py-3 text-xs">Transaction hash</th>
      </tr>
    </thead>
  );
}

export default EventHeader;
