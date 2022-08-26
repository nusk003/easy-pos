import {
  Header,
  ManageSection,
  ManageSectionTile,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useHotel } from '@src/xhr/query';
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

export const ManageCustom: React.FC = () => {
  const { data: hotel } = useHotel();

  return (
    <>
      <Header backgroundColor="#fafafa" title="Custom" />
      <SWrapper>
        <ManageSection
          title="Custom"
          description="Add custom links to your app."
        >
          {hotel?.customLinks
            ? hotel.customLinks
                .filter((customLink) => customLink?.enabled)
                .map((customLink) => (
                  <ManageSectionTile
                    key={customLink?.id}
                    title={customLink?.name}
                    description="Edit custom link"
                    location={{
                      location: '/manage/custom/link',
                      state: { customLink },
                    }}
                  />
                ))
            : null}

          <ManageSectionTile
            title="Add custom link"
            description="Add an external web link"
            location="/manage/custom/link"
          />
        </ManageSection>
      </SWrapper>
    </>
  );
};
