import { Customer, SearchProductsQueryVariables } from '@hm/sdk';
import { Button, Grid, Link, Text, TextAvatar } from '@src/components/atoms';
import { Inputs, Table } from '@src/components/molecules';
import { Header } from '@src/components/templates';
import { CustomersModal } from '@src/components/templates/customers';
import { theme } from '@src/components/theme';
import { useSearchCustomers } from '@src/xhr/query';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
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

export const CustomersAll: React.FC = () => {
  const location = useLocation<{ guestId: string } | undefined>();

  const history = useHistory();

  const [query, setQuery] = useState<SearchProductsQueryVariables>({
    limit: 7,
    offset: 0,
    query: null,
  });
  const [customers, setCustomers] = useState<Customer[]>();

  const [visibleCustomerModal, setVisibleCustomerModal] =
    useState<boolean>(false);

  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  const { data } = useSearchCustomers(query);
  const count = data?.count;

  useEffect(() => {
    if (data?.data) {
      setCustomers(data.data as Customer[]);
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

  useEffect(() => {
    if (location.state) {
      setQuery((s) => ({ ...s, searchTerm: location.state?.guestId }));
    }
  }, [location.state]);

  const handleClickCustomer = (customer: Customer) => {
    setCustomer({ ...customer });
    setVisibleCustomerModal(true);
  };

  return (
    <>
      <CustomersModal
        visible={visibleCustomerModal}
        customer={customer}
        onClose={() => {
          setTimeout(() => {
            setCustomer(undefined);
          }, 200);
          setVisibleCustomerModal(false);
        }}
      />
      <Header
        title="Customers"
        primaryButton={
          <Button
            buttonStyle="primary"
            leftIcon={<FaLocationArrow size={10} />}
            onClick={() => setVisibleCustomerModal(true)}
          >
            Add Customer
          </Button>
        }
      />

      <SWrapper>
        <Table.Provider>
          <Table.Header justifyContent="space-between">
            <Inputs.BasicText
              placeholder="Search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchQueryChange(e.target.value)
              }
              search
              name="allProductsSearch"
              autoComplete="off"
            />
          </Table.Header>
          <Table.Body>
            {customers?.length ? (
              customers.map((customer) => {
                return (
                  <Table.Row
                    key={customer.id}
                    onClick={
                      customer.nic
                        ? () => handleClickCustomer(customer as Customer)
                        : undefined
                    }
                  >
                    {customer.nic ? (
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
                              {customer?.firstName?.[0]}
                              {customer?.lastName?.[0]}
                            </TextAvatar>
                            <div>
                              <Text.Body fontWeight="semibold">
                                {customer.firstName}
                              </Text.Body>
                              <Text.Body fontWeight="semibold">
                                {customer.lastName}
                              </Text.Body>
                            </div>
                          </Grid>
                        </Table.Cell>
                        <Table.Cell>
                          <Text.Body fontWeight="semibold">
                            {customer.nic}
                          </Text.Body>
                          <Text.Body>{customer.phone}</Text.Body>
                        </Table.Cell>
                      </>
                    ) : (
                      <Table.Cell colSpan={2} style={{ textAlign: 'left' }}>
                        <Text.Body fontWeight="semibold">
                          Customer has not logged in yet
                        </Text.Body>
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        Updated:{' '}
                        {dayjs(customer.dateUpdated).format('DD/MM/YY')}
                      </Text.Body>
                      <Text.Body>
                        Created:{' '}
                        {dayjs(customer.dateCreated).format('DD/MM/YY')}
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
