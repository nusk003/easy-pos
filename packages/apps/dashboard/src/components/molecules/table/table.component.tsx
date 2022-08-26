import { PaginationSort } from '@hm/sdk';
import { CheckboxWrapper } from '@src/components/molecules/inputs/checkbox.component';
import { theme } from '@src/components/theme';
import React from 'react';
import {
  FaCheck,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
} from 'react-icons/fa';
import styled from 'styled-components';
import {
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  space as styledSpace,
  SpaceProps,
} from 'styled-system';

export const Provider = styled.table<SpaceProps>`
  table-layout: fixed;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
  max-width: 100%;
  border-radius: 8px;
  border: 0.5px solid #f4f4f4;

  ::-webkit-scrollbar {
    display: none;
  }

  ${styledSpace}
`;

export const Body = styled.tbody``;

const Head = styled.thead`
  padding: 16px;
`;

export const SHeaderContentWrapper = styled.div<
  GridProps & LayoutProps & FlexboxProps
>`
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  justify-content: left;
  align-items: center;

  ${grid}
  ${layout}
  ${flexbox}
`;

interface HeaderProps extends GridProps, LayoutProps, FlexboxProps {
  cursor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cursor,
  children,
  ...rest
}) => {
  return (
    <Head>
      <Row cursor={cursor || 'unset'}>
        <Cell noBorder width="100%" colSpan={100}>
          <SHeaderContentWrapper {...rest}>{children}</SHeaderContentWrapper>
        </Cell>
      </Row>
    </Head>
  );
};

export const Footer = styled.div`
  display: grid;
  margin: 16px 0;
  margin-bottom: 0;
  position: sticky;
  grid-auto-flow: column;
  align-items: center;
  left: 0;
`;

export const FooterCell = styled.div`
  padding: 16px;
  padding-top: 0;
  user-select: none;
  align-self: end;
`;

interface RowProps {
  cursor?: string;
}

export const Row = styled.tr<RowProps>`
  cursor: ${(props) =>
    props.cursor ? props.cursor : props.onClick ? 'pointer' : undefined};
  user-select: none;
`;

const HeaderCellWrapper = styled.th<{ colSpan?: number }>`
  text-align: left;
  padding: 16px;
  font-weight: ${theme.fontWeights.semibold};
  white-space: nowrap;

  column-span: ${(props): number => props.colSpan ?? 0};

  :hover {
    cursor: pointer;
  }
`;

const ArrowDown = styled(FaChevronDown)`
  margin-left: 8px;
  font-size: 10px;
`;

const ArrowUp = styled(FaChevronUp)`
  margin-left: 8px;
  font-size: 10px;
`;

interface HeaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  sorted?: PaginationSort | null;
  colSpan?: number;
}

export const HeaderCell: React.FC<HeaderCellProps> = ({
  children,
  sorted,
  colSpan,
  ...rest
}) => {
  let arrow = null;

  if (sorted === PaginationSort.Asc) {
    arrow = <ArrowUp />;
  } else if (sorted === PaginationSort.Desc) {
    arrow = <ArrowDown />;
  }

  return (
    <HeaderCellWrapper colSpan={colSpan} {...rest}>
      {children}
      {arrow}
    </HeaderCellWrapper>
  );
};

export const Cell = styled.td<{ colSpan?: number; noBorder?: boolean }>`
  text-align: left;
  padding: 16px;
  padding-right: 24px;
  border-top: ${(props) => (props.noBorder ? 'none' : '0.5px solid #f4f4f4')};
  width: 100vw;
  white-space: nowrap;

  column-span: ${(props): number => props.colSpan ?? 0};
`;

interface CheckboxProps {
  selected: boolean;
  disabled?: boolean;
  noWrapper?: boolean;
  onClick: () => void;
}

const SCheckboxCell = styled(Cell)`
  width: 0px;
  padding-right: 16px;
`;

export const Checkbox: React.FC<CheckboxProps> = ({
  onClick,
  selected,
  disabled,
  noWrapper,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onClick();
  };

  const Component = (
    <CheckboxWrapper
      selected={selected}
      disabled={disabled || false}
      onClick={handleClick}
    >
      <FaCheck color="#fff" />
    </CheckboxWrapper>
  );

  if (noWrapper) {
    return <>{Component}</>;
  }

  return <SCheckboxCell>{Component}</SCheckboxCell>;
};

export const PaginationWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 4px;
  position: sticky;
  top: 0px;
  width: min-content;
  border-radius: 4px;
`;

const SPaginationButtonWrapper = styled.div`
  margin-right: 12px;
  cursor: pointer;
  border-radius: 4px;
`;

interface PaginationButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: boolean;
  right?: boolean;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({
  left,
  right,
  ...rest
}) => {
  return (
    <SPaginationButtonWrapper {...rest}>
      {right ? <FaChevronRight /> : null}
      {left ? <FaChevronLeft /> : null}
    </SPaginationButtonWrapper>
  );
};
