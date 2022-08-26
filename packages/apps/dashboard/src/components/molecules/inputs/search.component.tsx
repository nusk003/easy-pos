import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import {
  ErrorText,
  Input as SearchInput,
  InputWrapper as SearchInputWrapper,
} from './text.component';

const SWrapper = styled.div``;

const STileWrapper = styled.span`
  display: grid;
  padding: 8px 12px;
  cursor: pointer;
`;

const SDropdownWrapperWrapper = styled.div`
  position: relative;
`;

const SDropdownWrapper = styled.div<{ minDropdownWidth: string }>`
  z-index: 2;
  position: absolute;
  display: grid;
  min-width: ${(props) => props.minDropdownWidth};
  top: 12px;
  border: 2px solid #ffffff;
  background: ${theme.colors.white};
  box-shadow: 0px 4px 16px rgba(18, 45, 115, 0.1);
  border-radius: 6px;
`;

export interface SearchItem {
  title: string;
  subheading?: string;
  payload?: any;
}

interface Props {
  name: string;
  placeholder?: string;
  label?: string;
  note?: string;
  data: SearchItem[];
  onClick?: (data: SearchItem) => void | Promise<void>;
  fallbackData?: SearchItem;
  onFallbackClick?: (fallbackData: SearchItem) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  noRegister?: boolean;
  allowedValues?: Array<string>;
  minDropdownWidth?: string;
  footer?: React.ReactNode;
  embedded?: boolean;
  disabled?: boolean;
  showSearchIcon?: boolean;
  color?: string;
  labelStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  autoComplete?: string;
  fontWeight?: string;
}

const SearchComponent: React.ForwardRefRenderFunction<HTMLInputElement, Props> =
  (
    {
      name,
      placeholder,
      data,
      onClick,
      fallbackData,
      onFallbackClick,
      onChange,
      onBlur,
      minDropdownWidth = '400px',
      footer,
      noRegister,
      allowedValues,
      labelStyle,
      wrapperStyle,
      label,
      note,
      embedded,
      showSearchIcon = true,
      color,
      disabled,
      fontWeight,
      autoComplete = 'off',
    },
    ref:
      | ((instance: HTMLInputElement | null) => void)
      | React.MutableRefObject<HTMLInputElement | null>
      | null
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { register, errors, setError } = useFormContext();

    const [state, setState] = useState({
      isDropdownOpen: false,
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current !== null) {
        if (!wrapperRef.current.contains(event.target as Node)) {
          setState((s) => ({ ...s, isDropdownOpen: false }));
        }
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (allowedValues?.length && inputRef.current !== null) {
        const { value } = inputRef?.current;

        const itemInList = allowedValues?.find((item) => item === value);

        if (!itemInList) {
          inputRef.current.value = '';
          if (name) {
            setError(name, 'Please select a value from the dropdown');
          }
        }
      }

      if (onBlur) {
        onBlur(e);
      }
    };

    const handleFocus = () => {
      setState((s) => ({ ...s, isDropdownOpen: true }));
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <SWrapper>
        {label ? (
          <Text.Body
            fontWeight="medium"
            style={labelStyle}
            mb={!note ? '16px' : '4px'}
          >
            {label}
          </Text.Body>
        ) : null}
        {note ? <Text.Notes mb="16px">{note}</Text.Notes> : null}
        <SearchInputWrapper style={wrapperStyle} embedded={embedded}>
          <SearchInput
            fontWeight={fontWeight}
            disabled={disabled}
            name={name}
            color={color}
            ref={(e: HTMLInputElement) => {
              if (register && !noRegister) {
                register(e);
              }
              if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement>).current = e;
              }
              if (inputRef) {
                inputRef.current = e;
              }
            }}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete={autoComplete}
          />
          {showSearchIcon && (
            <FaSearch color={theme.textColors.ultraLightGray} />
          )}
        </SearchInputWrapper>
        {name && errors?.[name]?.message ? (
          <ErrorText>{errors?.[name]?.message}</ErrorText>
        ) : null}
        {state.isDropdownOpen && data?.length ? (
          <SDropdownWrapperWrapper>
            <SDropdownWrapper
              minDropdownWidth={minDropdownWidth}
              ref={wrapperRef}
            >
              {data?.map((item) => {
                return (
                  <STileWrapper
                    key={item.title}
                    onClick={() => {
                      setState({ isDropdownOpen: false });
                      onClick?.(item);
                    }}
                  >
                    <Text.BoldDescriptor>{item.title}</Text.BoldDescriptor>
                    {item.subheading ? (
                      <Text.Descriptor>{item.subheading}</Text.Descriptor>
                    ) : null}
                  </STileWrapper>
                );
              })}
              {fallbackData ? (
                <STileWrapper
                  key={fallbackData.title}
                  onClick={() => {
                    setState({ isDropdownOpen: false });
                    onFallbackClick?.(fallbackData);
                  }}
                >
                  <Text.BoldDescriptor>
                    {fallbackData.title}
                  </Text.BoldDescriptor>
                  {fallbackData.subheading ? (
                    <Text.Descriptor>{fallbackData.subheading}</Text.Descriptor>
                  ) : null}
                </STileWrapper>
              ) : null}

              {data.length && footer ? footer : null}
            </SDropdownWrapper>
          </SDropdownWrapperWrapper>
        ) : null}
      </SWrapper>
    );
  };

export const Search = forwardRef(SearchComponent);
