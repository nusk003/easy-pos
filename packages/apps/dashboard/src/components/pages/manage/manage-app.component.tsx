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

export const ManageApp: React.FC = () => {
  return (
    <>
      <Header backgroundColor="#fafafa" title="App" />
      <SWrapper>
        <ManageSection
          title="App"
          description="Manage your app's preferences and branding."
        >
          <>
            <ManageSectionTile
              title="App store"
              description="Manage your app store information"
              location="/manage/app/app-store"
            />
            <ManageSectionTile
              title="Branding"
              description="Manage your app branding"
              location="/manage/app/branding"
            />
            <ManageSectionTile
              title="Preferences"
              description="Manage general app preferences"
              location="/manage/app/preferences"
            />
            <ManageSectionTile
              title="QR Code"
              description="View your app's QR Code"
              location="/manage/app/qr-code"
            />
            <ManageSectionTile
              title="Custom Domain"
              description="Add your own domain to your app"
              location="/manage/app/domain"
            />
          </>
        </ManageSection>
      </SWrapper>
    </>
  );
};
