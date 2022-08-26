import { theme } from '@src/components/theme';
import React, { forwardRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import {
  Input as SearchInput,
  InputWrapper as SearchInputWrapper,
} from './text.component';

const SWrapper = styled.div`
  display: inline-block;
`;

export interface SearchItem {
  title: string;
  subheading?: string;
  payload?: any;
}

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  embedded?: boolean;
  disabled?: boolean;
  fontWeight?: string;
  wrapperStyle?: React.CSSProperties;
}

const SearchComponent: React.ForwardRefRenderFunction<HTMLInputElement, Props> =
  ({ embedded, disabled, fontWeight, wrapperStyle, ...rest }, ref) => {
    return (
      <SWrapper>
        <SearchInputWrapper style={wrapperStyle} embedded={embedded}>
          <SearchInput
            fontWeight={fontWeight}
            disabled={disabled}
            ref={ref}
            autoComplete="off"
            {...rest}
          />
          <FaSearch color={theme.textColors.ultraLightGray} />
        </SearchInputWrapper>
      </SWrapper>
    );
  };

export const BasicSearch = forwardRef(SearchComponent);
