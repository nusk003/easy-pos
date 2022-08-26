import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div``;

const SManageSectionTilesWrapper = styled.div`
  margin-top: 32px;
  border-radius: 8px;
  padding: 32px;
  background: #fff;

  display: grid;
  align-items: center;
  justify-content: start;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  ${theme.mediaQueries.laptop} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${theme.mediaQueries.tablet} {
    grid-template-columns: 1fr;
  }
`;

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const ManageSection: React.FC<Props> = ({
  title,
  description,
  children,
}) => {
  return (
    <SWrapper>
      <Text.Primary fontWeight="semibold">{title}</Text.Primary>
      <Text.Descriptor mt="8px" color={theme.textColors.lightGray}>
        {description}
      </Text.Descriptor>
      <SManageSectionTilesWrapper>{children}</SManageSectionTilesWrapper>
    </SWrapper>
  );
};
