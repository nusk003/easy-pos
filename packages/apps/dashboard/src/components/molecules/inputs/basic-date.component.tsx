import React, { useRef, useState } from 'react';
import RDatePicker from 'react-datepicker';
import {
  Close,
  TextInput,
  InputWrapper,
  Label,
  Open,
  Placeholder,
  Wrapper,
} from './date.component';

interface Props {
  name: string;
  label?: string;
  range?: boolean;
  icon?: boolean;
  clearButton?: boolean;
  placeholder?: string;
  onChange: (date: Date | null) => void;
}

export const BasicDate: React.FC<Props> = ({
  name,
  label,
  range,
  icon,
  clearButton,
  placeholder,
  onChange,
  ...rest
}) => {
  const [date, setDate] = useState<Date | null>();

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

  const handleChange = (d: any) => {
    setDate(d);
    onChange(d);
  };

  return (
    <Wrapper>
      {label ? <Label>{label}</Label> : null}
      <InputWrapper embedded={range} range={range} icon={icon}>
        <Placeholder onClick={handleFocus} visibility={!date}>
          {placeholder}
        </Placeholder>
        <TextInput
          ref={inputRef}
          as={RDatePicker}
          name={name}
          selected={date}
          onChange={handleChange}
          {...rest}
        />
        {!date && icon ? <Open onClick={handleFocus} size={16} /> : null}
        {date && clearButton ? <Close onClick={handleClear} size={16} /> : null}
      </InputWrapper>
    </Wrapper>
  );
};
