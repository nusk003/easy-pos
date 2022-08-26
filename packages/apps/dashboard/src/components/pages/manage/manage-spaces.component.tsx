import {
  Header,
  ManageSection,
  ManageSectionTile,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import React from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  min-height: calc(100vh - 141px);
  margin-right: -16px;

  background: #fafafa;
  padding: 32px;

  display: grid;
  align-content: start;
  gap: 32px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    min-height: calc(100vh - 101px);
  }
`;

export const ManageSpaces: React.FC = () => {
  return (
    <>
      <Header backgroundColor="#fafafa" title="Spaces" />
      <SWrapper>
        <ManageSection
          title="Spaces"
          description="Manage spaces within your hotel."
        >
          <>
            <ManageSectionTile
              title="All spaces"
              description="Manage your in-app spaces"
              location="/manage/spaces/all"
            />
            <ManageSectionTile
              title="Add new space"
              description="Add details for a new space"
              location="/manage/spaces/space"
            />
          </>
        </ManageSection>
      </SWrapper>
    </>
  );
};
