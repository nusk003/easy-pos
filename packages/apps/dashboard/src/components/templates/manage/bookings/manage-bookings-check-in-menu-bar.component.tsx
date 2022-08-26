import { Text } from '@src/components/atoms';
import { theme } from '@src/components/theme';
import { useHotel } from '@src/xhr/query';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 32px;
  justify-content: left;
  overflow-x: scroll;
  position: sticky;
  top: 76.5px;
  background: #fafafa;
  padding: 16px 32px;
  z-index: 1;
  border-bottom: 0.5px solid #e8eaef;

  ::-webkit-scrollbar {
    display: none;
  }

  ${theme.mediaQueries.tablet} {
    top: 61px;
    padding: 16px;
  }
`;

const SName = styled(Text.Interactive)<{ disabled: boolean }>`
  white-space: nowrap;
  user-select: none;
  cursor: ${(props) => (!props.disabled ? 'pointer' : undefined)};
`;

export const ManageBookingsCheckInMenuBar: React.FC = () => {
  const { data: hotel } = useHotel();

  const history = useHistory();
  const location = useLocation();

  const pages = [
    {
      name: 'General',
      pathname: '/manage/bookings',
      disabled: !hotel?.bookingsSettings,
    },
    {
      name: 'Pre-arrival',
      pathname: '/manage/bookings/pre-arrival',
      disabled: !hotel?.bookingsSettings,
    },
    {
      name: 'Arrival',
      pathname: '/manage/bookings/arrival',
      disabled: !hotel?.bookingsSettings,
    },
    // {
    //   name: 'Departure',
    //   pathname: '/manage/bookings/departure',
    //   disabled: !hotel?.bookingsSettings,
    // },
    {
      name: 'Customization',
      pathname: '/manage/bookings/customization',
      disabled: !hotel?.bookingsSettings,
    },
  ];

  return (
    <SWrapper>
      {pages.map((page) => (
        <SName
          key={page.name}
          color={
            page.pathname === location.pathname
              ? theme.textColors.blue
              : theme.textColors.gray
          }
          onClick={() => {
            if (!page.disabled) {
              history.push(page.pathname);
            }
          }}
          disabled={page.disabled}
        >
          {page.name}
        </SName>
      ))}
    </SWrapper>
  );
};
