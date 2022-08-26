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

export const ManageFoodBeverage: React.FC = () => {
  return (
    <>
      <Header backgroundColor="#fafafa" title="Food & Beverage" />
      <SWrapper>
        <ManageSection
          title="Food & Beverage"
          description="Manage your restaurant and room service menus."
        >
          <>
            <ManageSectionTile
              title="Menus"
              description="Manage your in-app menus"
              location="/pricelists"
            />
            <ManageSectionTile
              title="Add new menu"
              description="Add details and create items for a new menu"
              location="/manage/food-beverage/menu"
            />
          </>
        </ManageSection>
      </SWrapper>
    </>
  );
};
