import React, { forwardRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';
import {
  Input,
  InputProps,
  InputWrapper,
  InputWrapperProps,
} from './text.component';

const SearchIcon: React.FC<{ searchLoading?: boolean }> = ({
  searchLoading,
}) => {
  return (
    <>{searchLoading ? <MoonLoader size={15} /> : <FaSearch size={16} />}</>
  );
};

interface Props extends Omit<InputProps, 'ref'> {
  name: string;
  search?: boolean;
  searchLoading?: boolean;
  inputWrapperProps?: InputWrapperProps;
}

export const BasicTextComponent: React.ForwardRefRenderFunction<
  HTMLInputElement,
  Props
> = ({ name, search, searchLoading, inputWrapperProps, ...rest }, ref) => {
  return (
    <InputWrapper {...inputWrapperProps}>
      <Input ref={ref} name={name} {...rest} />
      {search ? <SearchIcon searchLoading={searchLoading} /> : null}
    </InputWrapper>
  );
};

export const BasicText = forwardRef(BasicTextComponent);
