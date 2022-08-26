import { Feature } from '@src/components/atoms';
import {
  Header,
  ManageSection,
  ManageSectionTile,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useHotel, useUser } from '@src/xhr/query';
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

export const ManageHome: React.FC = () => {
  const { data: hotel } = useHotel();
  const { data: user } = useUser();

  return (
    <>
      <Header backgroundColor="#fafafa" title="Manage" />
      <SWrapper>
        <ManageSection
          title="Hotel"
          description="Manage general details about your hotel, team and app."
        >
          <>
            <ManageSectionTile
              title="Hotel"
              description="Manage your contact details"
              location="/manage/hotel"
            />
            {hotel?.countryCode === 'GB' ? (
              <Feature name="payments">
                <ManageSectionTile
                  title="Payments"
                  description="Manage card payments and your payout details"
                  location="/manage/payments"
                />
              </Feature>
            ) : null}
            <Feature name="launchkit">
              <ManageSectionTile
                title="App"
                description="Manage your app preferences and branding"
                location="/manage/app"
              />
            </Feature>
            <ManageSectionTile
              title="Team"
              description="Manage your staff and their permissions"
              location="/manage/team"
            />
            <Feature name="spaces">
              <ManageSectionTile
                title="Spaces"
                description="Manage spaces within your hotel"
                location="/manage/spaces"
              />
            </Feature>
            <Feature name="marketplace">
              <ManageSectionTile
                title="Marketplace"
                description="Manage your integrations with our partners"
                location="/manage/marketplace"
              />
            </Feature>
          </>
        </ManageSection>
        <ManageSection
          title="App Solutions"
          description="Manage which solutions are enabled in your app and their configuration."
        >
          <>
            <Feature name="spaces">
              <ManageSectionTile
                title="Food & Beverage"
                description="Manage your restaurant and room service menus"
                location="/manage/food-beverage"
              />
            </Feature>
            <Feature name="messages">
              <ManageSectionTile
                title="Messages"
                description="Manage your messaging availability"
                location="/manage/messages"
              />
            </Feature>
            <Feature name="bookings">
              <ManageSectionTile
                title="Bookings"
                description="Manage your check-in and check-out flows"
                location="/manage/bookings"
              />
            </Feature>
            <Feature name="pointsOfInterest">
              <ManageSectionTile
                title="Experiences"
                description="Manage points of interest and hotel experiences"
                location="/manage/experiences"
              />
            </Feature>

            <ManageSectionTile
              title="Custom"
              description="Add custom links to your app"
              location="/manage/custom"
            />
          </>
        </ManageSection>
        <ManageSection
          title="Account"
          description="Manage your individual user account data and enable notifications from your app solutions."
        >
          <>
            <ManageSectionTile
              title="Profile"
              description="Manage your user profile"
              location="/manage/profile"
            />
            <ManageSectionTile
              title="Notifications"
              description="Manage your notifications and reminders"
              location="/manage/notifications"
            />
          </>
        </ManageSection>
        {user?.developer ? (
          <ManageSection
            title="Developer"
            description="Manage your marketplace app and developer settings."
          >
            <>
              <ManageSectionTile
                title="Marketplace App"
                description="Manage your marketplace app listing"
                location="/manage/developer/marketplace-app"
              />
            </>
          </ManageSection>
        ) : null}
      </SWrapper>
    </>
  );
};
