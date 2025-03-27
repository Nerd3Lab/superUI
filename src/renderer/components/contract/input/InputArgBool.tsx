import { Icon } from '@iconify/react';
import styled from 'styled-components';
import Radio from '../../utility/Radio';
import { InputAbiItem } from '../../../../main/services/contractService';
interface Props extends SimpleComponent {
  inputValue: any[];
  onChangeInputValue: (index: number, value: any) => void;
  index: number;
  abi: InputAbiItem;
}

const InputArgBoolWrapper = styled.div``;

function InputArgBool({ abi, inputValue, onChangeInputValue, index }: Props) {
  const value = inputValue[index];
  return (
    <InputArgBoolWrapper>
      <div className="flex gap-3 items-center w-full">
        <div className="w-50">{abi.name}</div>

        <button className="flex w-40 text-sm justify-start items-center space-x-1 px-3 py-1 rounded-full border border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2] font-medium">
          <Icon
            icon="material-symbols:code"
            className="text-lg text-[#0BA5EC]"
          />
          <span>Bool</span>
        </button>

        <div className="h-full bg-gray-200 w-[1px]" />
        <div className="flex gap-6 w-full">
          <Radio
            checked={value === true}
            label="TRUE"
            name="argumentBoolean"
            onChange={() => {
              onChangeInputValue(index, true);
            }}
          />
          <Radio
            checked={value === false}
            label="FALSE"
            name="argumentBoolean"
            onChange={() => {
              onChangeInputValue(index, false);
            }}
          />
        </div>
      </div>
    </InputArgBoolWrapper>
  );
}

export default InputArgBool;
