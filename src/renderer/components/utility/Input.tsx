import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props extends SimpleComponent {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  type?: 'text' | 'number';
}

interface InputWrapperProps {
  hasError?: boolean;
}

const InputWrapper = styled.div<InputWrapperProps>`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  border: 1px solid ${(props) => (props.hasError ? 'red' : '#d1d5db')};
  border-radius: 0.75rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${(props) =>
      props.hasError ? 'red' : 'var(--color-brand-500)'};
  }
`;

function Input(props: Props) {
  const [search, setSearch] = useState<string>(props.value);
  const [displayError, setDisplayError] = useState<string | undefined>(
    props.error,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (displayError) {
      setDisplayError('');
    }
    props.onChange(e);
  };

  useEffect(() => {
    setSearch(props.value);
  }, [props.value]);

  useEffect(() => {
    setDisplayError(props.error);
  }, [props.error]);

  return (
    <>
      <InputWrapper hasError={!!displayError} className={props.className}>
        <input
          id="search"
          type={props.type || 'text'}
          value={search}
          onChange={handleChange}
          placeholder={props.placeholder || 'input'}
          className="border-0 outline-none text-gray-800 flex-1"
        />
      </InputWrapper>
      {displayError && (
        <div className="text-red-500 text-sm mt-1">{displayError}</div>
      )}
    </>
  );
}

export default Input;
