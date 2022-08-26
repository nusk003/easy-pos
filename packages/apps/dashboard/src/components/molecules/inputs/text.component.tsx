import { Text as StyledText } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import InputMask, { Props as InputMaskBase } from 'react-input-mask';
import styled, {
  css,
  FlattenInterpolation,
  ThemedStyledProps,
} from 'styled-components';
import {
  color,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';

type StyledWrapperProps = SpaceProps;

type StyledInputProps = TypographyProps;

type StyledCSS<P> = FlattenInterpolation<ThemedStyledProps<P, any>> | null;

interface HoverFocusStyleProps {
  embedded?: boolean;
  error?: boolean;
}

interface SWrapperProps extends StyledWrapperProps {
  hidden?: boolean;
}

const SWrapper = styled.div<SWrapperProps>`
  opacity: ${({ hidden }): number => (hidden ? 0 : 1)};
  position: ${({ hidden }): string => (hidden ? 'absolute' : 'relative')};
  ${space}
`;

const hoverFocusStyle = css<HoverFocusStyleProps>`
  outline: none;
  border-bottom: ${(props): string | null =>
    props.embedded ? `1px solid ${theme.colors.blue}` : null};
  border: ${(props): string | null =>
    props.embedded ? null : '1px solid rgba(7, 132, 248, 0.25)'};
  box-shadow: ${(props): string | null =>
    props.embedded ? null : '0px 0px 4px rgba(170, 177, 196, 0.25)'};

  border: ${(props): string | null =>
    props.error && !props.embedded
      ? '1px solid rgba(220, 15, 15, 0.25);'
      : null};
  box-shadow: ${(props): string | null =>
    props.error && !props.embedded
      ? '0px 0px 4px rgba(170, 177, 196, 0.25)'
      : null};
`;

export interface InputWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  embedded?: boolean;
  width?: string | number | undefined;
  error?: boolean;
  sideLabel?: boolean;
}

type LabelWrapperProps = SpaceProps;

export const InputWrapper = styled.div<InputWrapperProps>`
  display: grid;
  grid-template-columns: auto max-content;
  align-items: center;
  background: ${theme.colors.white};
  border: ${(props): string =>
    props.embedded ? '1px solid transparent' : '1px solid #dadce1'};
  box-shadow: ${(props): string =>
    props.embedded ? 'none' : '0px 0px 4px rgba(170, 177, 196, 0.25)'};
  padding: 8px 12px;
  border-radius: ${(props): string | null => (props.embedded ? null : '5px')};
  transition: background 0.3s, border 0.3s;
  position: relative;
  min-width: ${(props) =>
    // eslint-disable-next-line no-nested-ternary
    props.width
      ? typeof props.width === 'number'
        ? `${props.width}px`
        : props.width
      : undefined};
  border: ${(props): string | null =>
    props.error && !props.embedded
      ? '1px solid rgba(220, 15, 15, 0.25);'
      : null};
  box-shadow: ${(props): string | null =>
    props.error && !props.embedded
      ? '0px 0px 4px rgba(170, 177, 196, 0.25)'
      : null};
  width: ${(props) => (props.width ? 'max-content' : undefined)};

  :hover {
    ${(props): StyledCSS<HoverFocusStyleProps> =>
      props.sideLabel ? null : hoverFocusStyle}
  }

  :focus {
    ${(props): StyledCSS<HoverFocusStyleProps> =>
      props.sideLabel ? null : hoverFocusStyle}
  }
`;

export interface InputProps
  extends React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    StyledInputProps {
  fitContentLength?: number;
  sideLabel?: boolean;
  type?: string;
}

export const Input = styled.input<InputProps>`
  box-sizing: border-box;
  display: grid;
  border: none;
  font-family: ${theme.fontFamily};
  position: relative;
  font-size: 13px;
  color: ${theme.textColors.gray};
  overflow: hidden;
  line-height: 16px;
  resize: none;
  ${color};
  width: ${(props) =>
    props.width
      ? props.width
      : props.fitContentLength !== undefined
      ? `${props.fitContentLength + 1}ch`
      : '100%'};
  text-align: ${({ fitContentLength, sideLabel }): null | string => {
    if (typeof sideLabel === 'string') {
      return 'right';
    }
    return fitContentLength !== undefined ? 'center' : null;
  }};

  :disabled {
    background: none;
    color: ${theme.textColors.lightGray};
  }

  :-webkit-autofill {
    box-shadow: 0 0 0 1000px ${theme.colors.white} inset !important;
    border: 1px solid ${theme.colors.white};
  }

  ::-webkit-calendar-picker-indicator {
    background: none;
    display: none;
  }

  :hover {
    outline: none;
  }

  :focus {
    outline: none;
  }

  ::placeholder {
    color: ${theme.textColors.lightGray};
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ${typography}
`;

const STextWrapper = styled.div<LabelWrapperProps>`
  display: grid;
  grid-gap: 4px;
  margin-bottom: 16px;
  ${space};
`;

interface MaxCharactersWrapperProps {
  overLimit?: boolean;
}

const MaxCharactersWrapper = styled(
  StyledText.Notes
)<MaxCharactersWrapperProps>`
  display: grid;
  margin-left: 12px;
  margin-top: 4px;
  color: ${({ overLimit }): string | null =>
    overLimit ? theme.textColors.red : null};
`;

export const ErrorText = styled.div<SpaceProps>`
  color: ${theme.textColors.red};
  font-weight: 600;
  margin-top: 8px;
  ${space}
`;

const SSideLabelWrapper = styled(StyledText.Body)``;

export interface TextInputProps
  extends React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    SpaceProps,
    StyledInputProps {
  name: string;
  label?: string;
  note?: string;
  embedded?: boolean;
  multiLine?: boolean;
  noRegister?: boolean;
  wrapperStyle?: React.CSSProperties;
  fitContent?: boolean;
  type?: string;
  mask?: string | Array<string | RegExp>;
  sideLabel?: string | JSX.Element;
  labelStyle?: React.CSSProperties;
  maxCharacters?: number;
  hideError?: boolean;
  labelWrapperStyle?: LabelWrapperProps;
  width?: string;
}

export const Text: React.FC<TextInputProps> = ({
  name,
  label,
  note,
  embedded,
  multiLine,
  noRegister,
  wrapperStyle,
  fitContent,
  placeholder,
  onBlur,
  onFocus,
  hidden,
  type,
  mask,
  sideLabel,
  labelStyle,
  maxCharacters,
  onChange,
  hideError,
  width,
  mb,
  mt,
  ml,
  mr,
  labelWrapperStyle,
  disabled,
  ...rest
}) => {
  const { register, errors, setValue, watch } = useFormContext();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const registerRef = !noRegister ? register : undefined;

  const currencySymbol = format.getCurrencySymbol();

  const [length, setLength] = useState(inputRef.current?.value?.length || 0);

  const handleAutosizeTextarea = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputRef]);

  const formatCurrencyOnChange = useCallback(
    (value: string): string => {
      let newValue = value;
      newValue = newValue.replace(/[^0-9.-]+/g, ''); // Replace non numbers excluding decimal point
      if (newValue) {
        if (newValue[newValue.length - 1] !== '.') {
          newValue = parseFloat(Number(newValue).toFixed(2)).toString(); // Allow only 2 max decimals
          const mantissa = value.split('.')[1];
          if (mantissa?.length) {
            if (mantissa.length === 1 && mantissa[0] === '0') {
              newValue += '.0';
            } else if (mantissa.length >= 2 && mantissa[1] === '0') {
              if (parseInt(mantissa, 10) === 0) {
                newValue += '.00';
              } else {
                newValue += '0';
              }
            }
          }
        }
        newValue = `${currencySymbol}${newValue.replace(currencySymbol, '')}`; // Add currency symbol
      }
      return newValue;
    },
    [currencySymbol]
  );

  const placeholderLength = placeholder?.length;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLength(inputRef.current?.value.length || 0);

      if (onChange) {
        onChange(e);
        return;
      }

      if (type === 'currency') {
        const newValue = formatCurrencyOnChange(e.target.value);
        setValue(name, newValue);
      } else if (type === 'number') {
        setValue(name, Number(e.target.value));
      } else if (multiLine) {
        handleAutosizeTextarea();
      }
    },
    [
      onChange,
      type,
      multiLine,
      formatCurrencyOnChange,
      setValue,
      name,
      handleAutosizeTextarea,
    ]
  );

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type === 'currency') {
      setValue(name, format.currency(inputRef?.current?.value || '0'));
    }
    if (type === 'percentage') {
      setValue(name, format.percentage(inputRef?.current?.value || ''));
    }
    if (type === 'number') {
      setValue(name, Number(inputRef?.current?.value));
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(e);
    }
  };

  const asComponent = useMemo(() => {
    let c: string | typeof InputMask = 'input';
    if (multiLine) {
      c = 'textarea';
    } else if (mask) {
      c = InputMask;
    }

    return c as any;
  }, [multiLine, mask]);

  const maskProps = useMemo(() => {
    if (mask) {
      const m: InputMaskBase & {
        defaultValue?: string;
        maskPlaceholder?: string;
      } = {
        alwaysShowMask: true,
        inputRef: registerRef ? registerRef() : undefined,
        mask,
        maskPlaceholder: '',
      };

      let defaultValue = inputRef?.current?.value;

      if (type === 'number') {
        defaultValue = Number(inputRef?.current?.value) as unknown as any;
      }

      m.defaultValue = defaultValue;

      return m;
    }

    return {};
  }, [mask, registerRef, type]);

  const ph = React.useMemo(() => {
    if (placeholder) {
      if (type === 'currency') {
        return currencySymbol + placeholder;
      }
    }
    return placeholder;
  }, [currencySymbol, placeholder, type]);

  useEffect(() => {
    if (type === 'currency') {
      const value = inputRef?.current?.value;

      if (value) {
        const newValue = format.currency(value);

        if (inputRef?.current) {
          inputRef.current.value = newValue;
        }
      }
    } else if (type === 'percentage') {
      const value = inputRef?.current?.value;
      if (value) {
        const newValue = format.percentage(inputRef?.current?.value || '');

        if (inputRef?.current) {
          inputRef.current.value = newValue;
        }
      }
    } else if (type === 'number') {
      const value = inputRef?.current?.value;
      if (value) {
        const newValue = value.toString();

        if (inputRef?.current) {
          inputRef.current.value = newValue;
        }
      }
    }
  }, [type]);

  useEffect(() => {
    if (multiLine) {
      handleAutosizeTextarea();
    }
  }, [handleAutosizeTextarea, multiLine]);

  const SideLabel = useMemo(() => {
    if (!sideLabel) {
      return () => null;
    }

    if (typeof sideLabel === 'string') {
      return () => (
        <SSideLabelWrapper ml="small">{sideLabel}</SSideLabelWrapper>
      );
    }

    return () => sideLabel;
  }, [sideLabel]);

  return (
    <SWrapper hidden={hidden} mt={mt} ml={ml} mb={mb} mr={mr}>
      {label ? (
        <STextWrapper {...labelWrapperStyle}>
          {label ? (
            <StyledText.Body style={labelStyle} fontWeight="medium">
              {label}
            </StyledText.Body>
          ) : null}
          {note ? <StyledText.Descriptor>{note}</StyledText.Descriptor> : null}
        </STextWrapper>
      ) : null}
      <InputWrapper embedded={embedded} style={wrapperStyle} width={width}>
        <Input
          as={asComponent}
          autoComplete="off"
          name={name}
          ref={(e: HTMLInputElement) => {
            inputRef.current = e;
            if (registerRef) {
              registerRef(e);
            }
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          fitContentLength={
            fitContent ? length || placeholderLength : undefined
          }
          placeholder={ph}
          type={type || 'text'}
          sideLabel={!!sideLabel}
          width={width}
          disabled={disabled}
          {...maskProps}
          {...rest}
        />
        <SideLabel />
      </InputWrapper>
      {maxCharacters ? (
        <MaxCharactersWrapper overLimit={length > maxCharacters}>
          {watch(name)?.length || 0}/{maxCharacters}
        </MaxCharactersWrapper>
      ) : null}
      {!hideError && errors?.[name]?.message ? (
        <>
          <ErrorText>{errors?.[name]?.message}</ErrorText>
        </>
      ) : null}
    </SWrapper>
  );
};
