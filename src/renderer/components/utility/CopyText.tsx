import { Icon } from '@iconify/react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

interface Props extends SimpleComponent {
  value: string;
  size?: string;
}

const CopyTextWrapper = styled.div`
  .icon-hover {
    &:hover {
      color: var(--color-brand-400);
    }
  }
`;

function CopyText(props: Props) {
  const classNameString = props.size ? props.size : 'text-xl';

  const copyText = async (e: any) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(props.value);
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <CopyTextWrapper onClick={copyText}>
      <Icon
        icon="ph:copy-duotone"
        className={`cursor-pointer text-gray-400 icon-hover ${classNameString}`}
      />
    </CopyTextWrapper>
  );
}

export default CopyText;
