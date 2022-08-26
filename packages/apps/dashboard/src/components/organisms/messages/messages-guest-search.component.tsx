import { Guest, PaginationSort } from '@hm/sdk';
import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import _ from 'lodash';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';

const SWrapper = styled.div`
  display: grid;
  align-items: center;
  height: 50px;
  border-bottom: 0.5px solid #e8eaef;
  padding-left: 16px;
  margin-right: -16px;
  padding-right: 16px;

  ${theme.mediaQueries.tablet} {
    padding-left: 16px;
  }
`;

const SSearchWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: start;
  grid-auto-columns: auto 1fr;
`;

interface Props {
  onGuestChange: (guest: Guest) => void;
}

export const MessagesGuestSearch: React.FC<Props> = ({ onGuestChange }) => {
  const { data: hotel } = useHotel();

  const formMethods = useForm();

  const [searchGuests, setSearchGuests] = useState<Guest[]>([]);

  const [guest, setGuest] = useState<Guest | undefined>(undefined);

  const handleSearchQueryChange = _.debounce(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSearchGuests([]);
      return;
    }

    const { searchGuests } = await sdk.searchGuests({
      limit: 4,
      offset: 0,
      query: searchQuery,
      startDate: null,
      endDate: null,
      anonGuests: false,
    });

    if (searchGuests?.data?.length) {
      setSearchGuests(searchGuests.data as Guest[]);
    }
  }, 300);

  return (
    <SWrapper>
      <FormContext {...formMethods}>
        <Form.Provider gridGap="8px">
          <SSearchWrapper>
            <Text.Body fontWeight="semibold" mr="4px">
              To
            </Text.Body>
            <Inputs.Search
              disabled={!hotel?.messagesSettings?.enabled}
              placeholder="Type to add a guest"
              embedded
              color={
                formMethods.watch('searchGuest') ===
                `${guest?.firstName} ${guest?.lastName}`
                  ? theme.textColors.blue
                  : theme.textColors.gray
              }
              fontWeight="medium"
              showSearchIcon={false}
              data={searchGuests.map((guest) => ({
                title: `${guest.firstName} ${guest.lastName}`,
                payload: guest,
              }))}
              onChange={(e) => handleSearchQueryChange(e.currentTarget.value)}
              onClick={({ title, payload }) => {
                setGuest(payload);
                onGuestChange(payload as Guest);
                formMethods.setValue('searchGuest', title);
              }}
              name="searchGuest"
            />
          </SSearchWrapper>
        </Form.Provider>
      </FormContext>
    </SWrapper>
  );
};
