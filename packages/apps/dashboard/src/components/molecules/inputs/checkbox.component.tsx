import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';
import styled from 'styled-components';
import { space as styledSpace, SpaceProps } from 'styled-system';

type StyledProps = SpaceProps;

const SWrapper = styled.div<StyledProps>`
  display: grid;
  grid-gap: 10px;
  ${styledSpace};
`;

const SInputWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 16px;
  box-sizing: content-box;
`;

const SSideLabelText = styled(Text.Body)<{ disabled: boolean }>`
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

interface CheckboxWrapperProps {
  selected: boolean;
  disabled: boolean;
}

export const CheckboxWrapper = styled.div<CheckboxWrapperProps>`
  display: inline-grid;
  width: 17px;
  height: 17px;
  padding: 2.5px;
  cursor: pointer;
  user-select: none;
  align-content: center;
  justify-content: center;
  transition: 0.3s all;
  background: ${(props): string =>
    props.selected ? theme.colors.altBlue : '#fff'};
  box-shadow: ${(props): string =>
    props.selected ? 'none' : '0px 0px 4px rgba(170, 177, 196, 0.25)'};
  border: ${(props): string =>
    `1px solid ${props.selected ? 'transparent' : '#dadce1'}`};
  border-radius: 6px;
  opacity: ${(props): number => (props.disabled ? 0.5 : 1)};
`;

interface SToggleWrapperProps {
  selected: boolean;
  disabled: boolean;
}

const SToggleWrapper = styled.div<SToggleWrapperProps>`
  display: grid;
  width: 36px;
  height: 24px;
  border-radius: 100px;
  cursor: pointer;
  user-select: none;
  align-items: center;
  transition: 0.3s all;
  box-sizing: content-box;
  background: ${(props): string =>
    props.selected ? theme.colors.altBlue : '#e8eaef'};
  opacity: ${(props): number => (props.disabled ? 0.5 : 1)};
`;

interface SToggleCircleProps {
  selected: boolean;
}

const SToggleCircle = styled.div<SToggleCircleProps>`
  display: inline-grid;
  background: #fff;
  width: 18px;
  height: 18px;
  margin-left: ${(props): number => (props.selected ? 14 : 5)}px;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
  transition: 0.3s all;
`;

const SCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const SErrorText = styled.div`
  color: ${theme.textColors.red};
  font-weight: 600;
`;

interface Props
  extends Omit<
      React.HTMLAttributes<HTMLInputElement>,
      'onClick' | 'defaultValue'
    >,
    StyledProps {
  name: string;
  toggle?: boolean;
  defaultValue?: boolean;
  value?: boolean;
  onClick?: (value: boolean) => void;
  noRegister?: boolean;
  disabled?: boolean;
  onChangeForm?: boolean;
  sideLabel?: string;
  boldSideLabel?: boolean;
  sideLabelDescription?: string;
}

export const Checkbox: React.FC<Props> = ({
  name,
  defaultValue,
  value,
  toggle,
  boldSideLabel,
  sideLabel,
  sideLabelDescription,
  onClick,
  noRegister = false,
  disabled = false,
  onChangeForm = false,
  ...rest
}) => {
  const { errors, register, watch } = useFormContext() || {};

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [state, setState] = useState({
    selected: defaultValue,
  });

  useEffect(() => {
    setState((s) => ({
      ...s,
      selected: value !== undefined ? value : defaultValue,
    }));
  }, [defaultValue, value]);

  const handleInputClick = () => {
    const newSelected = !state.selected;
    state.selected = newSelected;
    setState({ ...state });
    if (onClick) {
      onClick(newSelected);
    }
  };

  const handleClick = () => {
    if (disabled) {
      return;
    }

    if (inputRef?.current) {
      inputRef.current.click();
      if (onChangeForm) {
        inputRef.current.click();
      }
    }
  };

  const registerRef = !noRegister ? register : undefined;

  const selected =
    value !== undefined
      ? value
      : !noRegister
      ? !!watch(name)
      : !!state.selected;

  useEffect(() => {
    if (!noRegister && defaultValue && inputRef?.current) {
      if (!onClick) {
        inputRef.current.click();
      }
    }
  }, [defaultValue, noRegister, onClick]);

  return (
    <SWrapper {...rest}>
      <SInputWrapper>
        <SCheckbox
          type="checkbox"
          name={name}
          ref={(e: HTMLInputElement) => {
            if (registerRef) {
              registerRef(e);
            }
            inputRef.current = e;
          }}
          onClick={handleInputClick}
          defaultValue={defaultValue as any}
        />
        {toggle ? (
          <SToggleWrapper
            disabled={disabled}
            selected={selected}
            onClick={handleClick}
          >
            <SToggleCircle selected={selected} />
          </SToggleWrapper>
        ) : (
          <CheckboxWrapper
            disabled={disabled}
            onClick={handleClick}
            selected={selected}
          >
            <FaCheck style={{ color: theme.colors.white }} />
          </CheckboxWrapper>
        )}
        {sideLabel || sideLabelDescription ? (
          <SSideLabelText
            disabled={disabled}
            fontWeight={boldSideLabel ? 'medium' : undefined}
          >
            {sideLabel}
            {sideLabelDescription ? (
              <Text.SecondarySubtitle mt="4px">
                {sideLabelDescription}
              </Text.SecondarySubtitle>
            ) : null}
          </SSideLabelText>
        ) : null}
      </SInputWrapper>
      {errors?.[name]?.message ? (
        <SErrorText>{errors?.[name]?.message}</SErrorText>
      ) : null}
    </SWrapper>
  );
};
