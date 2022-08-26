import { Text } from '@src/components/atoms';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useRef, useState } from 'react';
import RDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { Controller, EventFunction, useFormContext } from 'react-hook-form';
import { FaRegCalendar, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import {
  Input as TextInput,
  InputWrapper as TextInputWrapper,
} from './text.component';

dayjs.extend(utc);

export { TextInput };

export const Wrapper = styled.div`
  width: min-content;
`;

interface InputWrapperProps {
  icon?: boolean;
  range?: boolean;
  embedded?: boolean;
}

export const InputWrapper = styled(TextInputWrapper)<InputWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${(props): string => (props.icon ? '13ch' : '9ch')};
  background: transparent;
  box-sizing: content-box;

  :hover {
    border-bottom: ${(props): string | null =>
      props.range ? '1px solid transparent' : null};
  }

  :focus {
    border-bottom: ${(props): string | null =>
      props.range ? '1px solid transparent' : null};
  }
`;

interface PlaceholderProps {
  visibility: boolean;
  alignText?: string;
}

export const Placeholder = styled(Text.Descriptor)<PlaceholderProps>`
  visibility: ${(props): string => (props.visibility ? 'visible' : 'hidden')};
  position: absolute;
  z-index: 1;
  user-select: none;
  cursor: pointer;
  width: inherit;
  text-align: ${(props) => props.alignText || 'left'};
`;

export const Close = styled(FaTimes)`
  cursor: pointer;
`;

export const Open = styled(FaRegCalendar)`
  cursor: pointer;
`;

export const Label = styled(Text.Body)`
  font-weight: ${(props) => props.theme.fontWeights.medium};
  margin-bottom: 16px;
`;

interface InputProps extends ReactDatePickerProps {
  icon?: boolean;
}

const Input = styled(TextInput)<InputProps>`
  min-width: 0;
  width: 10ch;
  cursor: ${(props): string | null => (props.icon ? 'pointer' : null)};
`;

interface Props {
  name: string;
  label?: string;
  range?: boolean;
  icon?: boolean;
  clearButton?: boolean;
  placeholder?: string;
  placeholderAlign?: string;
  onChange?: (date: Date) => void;
}

export const Date: React.FC<Props> = ({
  name,
  label,
  range,
  icon,
  clearButton,
  placeholder,
  placeholderAlign,
  onChange,
  ...rest
}) => {
  const { control, register, watch } = useFormContext();

  const [date, setDate] = useState<Date>();

  const inputRef = useRef<any>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.clear();
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.handleFocus();
    }
  };

  const handleChange: EventFunction = ([d]): Date => {
    const newDate = dayjs(d).toDate();
    if (onChange) {
      onChange(newDate);
    }
    setDate(newDate);
    return newDate;
  };

  return (
    <Wrapper>
      {label ? <Label>{label}</Label> : null}
      <InputWrapper embedded={range} range={range} icon={icon}>
        {!watch(name) ? (
          <Placeholder
            alignText={placeholderAlign}
            onClick={handleFocus}
            visibility={!date}
          >
            {placeholder}
          </Placeholder>
        ) : null}

        <Controller
          as={
            <Input
              as={RDatePicker}
              selected={date}
              openToDate={date}
              dateFormat="dd/MM/yyyy"
              popperPlacement="top-start"
              ref={inputRef}
              autoComplete="off"
              onChange={() => undefined}
              {...rest}
            />
          }
          onChange={handleChange}
          control={control}
          register={register}
          name={name}
          valueName="selected"
        />
        {!date && icon ? <Open onClick={handleFocus} size={16} /> : null}
        {date && clearButton ? <Close onClick={handleClear} size={16} /> : null}
      </InputWrapper>
    </Wrapper>
  );
};
