import styled from 'styled-components';
import Input from '../utility/Input';
import { Icon } from '@iconify/react';
import Radio from '../utility/Radio';
import { useState } from 'react';

interface Props extends SimpleComponent {}

const ContractDeployInputWrapper = styled.div``;

function ContractDeployInput(props: Props) {
  return (
    <ContractDeployInputWrapper>
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
          <div className="text-gray-600 text-sm">Set contract parameter</div>
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
    </ContractDeployInputWrapper>
  );
}

export default ContractDeployInput;
