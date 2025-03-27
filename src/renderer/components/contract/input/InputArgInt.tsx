import { Icon } from '@iconify/react';
import styled from 'styled-components';
import Input from '../../utility/Input';
import { InputAbiItem } from '../../../../main/services/contractService';

interface Props extends SimpleComponent {
  onChangeInputValue: (index: number, value: any) => void;
  inputValue: any[];
  abi: InputAbiItem;
  index: number;
}

const InputArgIntWrapper = styled.div``;

function InputArgInt({ abi, onChangeInputValue, inputValue, index }: Props) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onChangeInputValue(index, value);
  };

  return (
    <InputArgIntWrapper>
      <div className="flex gap-3 items-center w-full">
        <div className="w-50">{abi.name}</div>
        <button className="flex w-40 text-sm justify-start items-center space-x-1 px-3 py-1 rounded-full border border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2] font-medium">
          <Icon
            icon="material-symbols:code"
            className="text-lg text-[#0BA5EC]"
          />
          <span>{abi.type}</span>
        </button>

        <div className="h-full bg-gray-200 w-[1px]" />
        <Input
          value={inputValue[index]}
          onChange={onChange}
          placeholder="number"
          className="w-full"
        />
      </div>
    </InputArgIntWrapper>
  );
}

export default InputArgInt;
