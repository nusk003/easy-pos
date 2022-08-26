import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

interface SWrapperProps {
  backgroundColor: string | undefined;
}

const SWrapper = styled.div<SWrapperProps>`
  padding: 8px;
  border-radius: 8px;
  display: grid;
  align-items: center;
  justify-items: center;
  border: 1px solid ${theme.colors.gray};
  width: 56px;
  height: 56px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  ${space}
`;

interface Props extends SpaceProps {
  backgroundColor?: string;
  src: string | undefined;
}

export const ManageMarketplaceLogo: React.FC<Props> = ({
  backgroundColor,
  src,
  ...rest
}) => {
  return (
    <SWrapper backgroundColor={backgroundColor} {...rest}>
      <img src={src} width="70%" />
    </SWrapper>
  );
};
