import {
  Header,
  ManageFormWrapper,
  ManageSection,
  ManageSectionTile,
} from '@src/components/templates';
import React from 'react';

export const ManageExperiences: React.FC = () => {
  return (
    <>
      <Header backgroundColor="#fafafa" title="Experiences" />
      <ManageFormWrapper>
        <ManageSection
          title="Experiences"
          description="Manage points of interest and hotel experiences."
        >
          <>
            <ManageSectionTile
              title="Points of Interest"
              description="Manage nearby points of interest"
              location="/manage/experiences/points-of-interest"
            />
          </>
        </ManageSection>
      </ManageFormWrapper>
    </>
  );
};
