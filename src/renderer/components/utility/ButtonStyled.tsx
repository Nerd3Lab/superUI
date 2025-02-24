import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import styled from 'styled-components';

const ButtonStyledWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  color: white;

  ${({ color, disabled }) => {
    return !disabled
      ? `background: linear-gradient(40deg, #D00128 0%, #D00128 90%);`
      : 'background-color: #829aa6;';
  }}

  overflow: hidden;
  transition: all 0.3s ease-in-out;
  :hover {
    * {
      transition: all 0.3s ease-in-out;
      ${({ disabled }) => {
        return !disabled ? 'color: #ffffff;' : '';
      }}
    }
    .overlay {
      ${({ color }) => {
        return color === 'secondary'
          ? 'transform: translateY(0);'
          : 'transform: translateX(0);';
      }}
    }
  }
  button {
    padding: 0.5rem 1rem;
    position: relative;
  }
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: all 0.3s ease-in-out;
    transform: translateY(100%);
    ${({ color, disabled }) => {
      return !disabled
        ? `background: linear-gradient(90deg, #a3011f 0%, #a3011f 100%);`
        : 'background-color: transparent;';
    }}
    ${({ color }) => {
      return color === 'secondary'
        ? 'transform: translateY(101%);'
        : 'transform: translateX(-101%);';
    }}
  }
`;

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties;
  onClick?: (e: any) => any;
  children: React.ReactNode;
  disabled?: boolean;
  tone?: string;
  className?: string;
  classContainer?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: any;
  color?: 'primary' | 'secondary' | string;
}

function ButtonStyled({
  className,
  disabled,
  onClick,
  style,
  color,
  children,
  type,
  loading,
  classContainer,
  ...others
}: Props) {
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      console.log('enter press here! ');
    }
  };

  const onClickButton = (e: any) => {
    if (disabled || loading) {
      return;
    }
    return onClick && onClick(e);
  };
  return (
    <ButtonStyledWrapper
      className={`text-base rounded-full relative overflow-hidden text-center cursor-pointer ${classContainer}`}
      style={style}
      disabled={disabled || loading}
      onClick={onClickButton}
    >
      <div className="overlay"></div>
      <button
        className={
          className
            ? `cursor-pointer ${classContainer}`
            : 'cursor-pointer button-hover'
        }
        disabled={disabled || loading}
        type={type}
        {...others}
      >
        {loading ? <Icon icon={'line-md:loading-twotone-loop'} /> : children}
      </button>
    </ButtonStyledWrapper>
  );
}

export default ButtonStyled;
