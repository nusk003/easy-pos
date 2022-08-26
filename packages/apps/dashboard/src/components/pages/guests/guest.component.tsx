import { Link, Text, TextAvatar } from '@src/components/atoms';
import {
  GuestsMetricsOverview,
  GuestsOrders,
  Header,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import { useGuest } from '@src/xhr/query';
import React from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: 24px;
  padding: 36px;
  padding-right: 16px;

  ${theme.mediaQueries.laptop} {
    grid-template-columns: repeat(8, 1fr);
    grid-column-gap: 0;
    grid-row-gap: 24px;
  }

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    padding-right: 0;
  }
`;

const SContactInformation = styled.div`
  grid-column: 1 / 5;
  ${theme.mediaQueries.laptop} {
    grid-column: 1 / 9;
  }
`;

const SNameWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-template-rows: repeat(2, min-content);
  grid-column-gap: ${theme.space.medium}px;
`;

const SMetricsContainer = styled.div`
  display: grid;
  grid-column: 5 / 13;
  gap: 48px;

  ${theme.mediaQueries.laptop} {
    grid-column: 1 / 9;
    gap: 24px;
  }
`;

export const Guest: React.FC = () => {
  const guestId =
    useRouteMatch<{ guestId: string }>('/guests/:guestId')?.params?.guestId;

  const { data: guest } = useGuest(guestId);

  if (!guestId || !guest || !guest?.id) {
    return null;
  }

  return (
    <>
      <Header title={`${guest.firstName} ${guest.lastName}`} />
      <SWrapper>
        <SContactInformation>
          <SNameWrapper>
            <TextAvatar
              background={theme.colors.lightGray}
              size={38}
              color={theme.textColors.lightGray}
              gridArea="1 / 1 / 3 / 2"
            >
              {guest?.firstName?.[0]}
              {guest?.lastName?.[0]}
            </TextAvatar>
            <Text.Interactive gridArea="1 / 2 / 2 / 3">
              {guest?.firstName}
            </Text.Interactive>
            <Text.Interactive gridArea="2 / 2 / 3 / 3;">
              {guest?.lastName}
            </Text.Interactive>
          </SNameWrapper>
          <Text.Interactive mt="large">Contact Information</Text.Interactive>
          <Link
            mt="small"
            gridTemplateColumns="max-content"
            onClick={() => {
              window.location.href = `mailto:${guest?.email}`;
            }}
            disableOnClick={false}
          >
            <FiMail />
            {guest?.email}
          </Link>
          {guest.mobile ? (
            <Link
              mt="small"
              gridTemplateColumns="max-content"
              onClick={() => {
                window.location.href = `tel:+${format.mobile(guest)}`;
              }}
              disableOnClick={false}
            >
              <FiPhone />
              {format.mobile(guest)}
            </Link>
          ) : null}
        </SContactInformation>
        <SMetricsContainer>
          <GuestsMetricsOverview guest={guest} />
          {guest.orders.length ? <GuestsOrders guest={guest} /> : null}
        </SMetricsContainer>
      </SWrapper>
    </>
  );
};
