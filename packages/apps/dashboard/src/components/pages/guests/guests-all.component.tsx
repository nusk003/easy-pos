import { Guest, PaginationSort, SearchGuestsQueryVariables } from '@hm/sdk';
import { Grid, Link, Text, TextAvatar } from '@src/components/atoms';
import { Inputs, Table } from '@src/components/molecules';
import { Header } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useSearchGuests } from '@src/xhr/query/search-guests.query';
import * as CountryCodes from 'country-code-info';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  padding: 32px;
  padding-right: 16px;
  padding-bottom: 0;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    padding-bottom: 0;
    padding-right: 0;
  }
`;

export const GuestsAll: React.FC = () => {
  const location = useLocation<{ guestId: string } | undefined>();

  const history = useHistory();

  const [query, setQuery] = useState<SearchGuestsQueryVariables>({
    limit: 7,
    offset: 0,
    query: null,
    startDate: null,
    endDate: null,
    anonGuests: false,
  });
  const [guests, setGuests] = useState<Guest[]>();

  const { data } = useSearchGuests(query);
  const count = data?.count;

  useEffect(() => {
    if (data?.data) {
      setGuests(data.data as Guest[]);
    }
  }, [data?.data]);

  const handleSearchQueryChange = _.debounce((searchQuery: string) => {
    searchQuery = searchQuery.replace(/#/g, '');
    setQuery((s) => ({ ...s, query: searchQuery }));
  }, 300);

  const handlePage = (direction: 'next' | 'prev') => {
    if (count === undefined) {
      return;
    }

    setQuery((s) => {
      let offset = s.offset || 0;

      if (direction === 'next' && offset + 7 <= count) {
        offset += 7;
      } else if (direction === 'prev' && offset !== 0) {
        offset -= 7;
      }

      return { ...s, offset };
    });
  };

  const toggleAnonGuests = () => {
    setQuery((s) => ({ ...s, anonGuests: !s.anonGuests }));
  };

  useEffect(() => {
    if (location.state) {
      setQuery((s) => ({ ...s, searchTerm: location.state?.guestId }));
    }
  }, [location.state]);

  const handleClickGuest = (guest: Guest) => {
    history.push(`/guests/${guest.id}`, guest);
  };

  return (
    <>
      <Header title="Guests" />

      <SWrapper>
        <Table.Provider>
          <Table.Header justifyContent="space-between">
            <Inputs.BasicText
              placeholder="Search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchQueryChange(e.target.value)
              }
              search
              name="allGuestsSearch"
              autoComplete="off"
            />

            <Link disableOnClick={false} onClick={toggleAnonGuests}>
              {query.anonGuests
                ? 'Hide anonymous guests'
                : 'Show anonymous guests'}
            </Link>
          </Table.Header>
          <Table.Body>
            {guests?.length ? (
              guests.map((guest) => {
                return (
                  <Table.Row
                    key={guest.id}
                    onClick={
                      guest.email
                        ? () => handleClickGuest(guest as Guest)
                        : undefined
                    }
                  >
                    {guest.email ? (
                      <>
                        <Table.Cell>
                          <Grid
                            gridAutoFlow="column"
                            gridGap="8px"
                            justifyContent="start"
                            alignItems="center"
                          >
                            <TextAvatar
                              size={40}
                              background={theme.colors.lightGray}
                              color={theme.textColors.lightGray}
                            >
                              {guest?.firstName?.[0]}
                              {guest?.lastName?.[0]}
                            </TextAvatar>
                            <div>
                              <Text.Body fontWeight="semibold">
                                {guest.firstName}
                              </Text.Body>
                              <Text.Body fontWeight="semibold">
                                {guest.lastName}
                              </Text.Body>
                            </div>
                          </Grid>
                        </Table.Cell>
                        <Table.Cell>
                          <Text.Body fontWeight="semibold">
                            {guest.email}
                          </Text.Body>
                          <Text.Body>
                            {guest.mobileCountryCode && guest.mobile
                              ? `+${
                                  CountryCodes.findCountry({
                                    a2: guest.mobileCountryCode,
                                  })?.dial
                                } ${guest.mobile}`
                              : undefined}
                          </Text.Body>
                        </Table.Cell>
                      </>
                    ) : (
                      <Table.Cell colSpan={2} style={{ textAlign: 'left' }}>
                        <Text.Body fontWeight="semibold">
                          Guest has not logged in yet
                        </Text.Body>
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        Last on app:{' '}
                        {dayjs(guest.dateUpdated).format('DD/MM/YY')}
                      </Text.Body>
                      <Text.Body>
                        Created: {dayjs(guest.dateCreated).format('DD/MM/YY')}
                      </Text.Body>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={9} style={{ textAlign: 'center' }}>
                  <Text.BodyBold>No results found</Text.BodyBold>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
          <Table.Footer>
            <Table.FooterCell>
              <Table.PaginationWrapper>
                <Table.PaginationButton
                  left
                  onClick={() => handlePage('prev')}
                />
                <Table.PaginationButton
                  right
                  onClick={() => handlePage('next')}
                />
              </Table.PaginationWrapper>
            </Table.FooterCell>
            <Table.FooterCell>
              <Text.Interactive textAlign="right">
                Page{' '}
                {query.limit && query.offset
                  ? (query.limit + query.offset) / query.limit
                  : 1}
              </Text.Interactive>
            </Table.FooterCell>
          </Table.Footer>
        </Table.Provider>
      </SWrapper>
    </>
  );
};
