import { Customer, Sale, SearchProductsQueryVariables } from '@hm/sdk';
import { Button, Grid, Link, Text, TextAvatar } from '@src/components/atoms';
import { Inputs, Table } from '@src/components/molecules';
import { Header } from '@src/components/templates';
import { CustomersModal } from '@src/components/templates/customers';
import { theme } from '@src/components/theme';
import { useSearchCustomers } from '@src/xhr/query';
import { useSearchSales } from '@src/xhr/query/search-sales.query';
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

export const SalesAll: React.FC = () => {
  const location = useLocation<{ guestId: string } | undefined>();

  const history = useHistory();

  const [query, setQuery] = useState<SearchProductsQueryVariables>({
    limit: 7,
    offset: 0,
    query: null,
  });
  const [sales, setSales] = useState<Sale[]>();

  const [visibleCustomerModal, setVisibleCustomerModal] =
    useState<boolean>(false);

  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  const { data } = useSearchSales(query);
  const count = data?.count;

  useEffect(() => {
    if (data?.data) {
      setSales(data.data as Sale[]);
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

  const handleClickSale = (sale: Sale) => {
    history.push(`/sale/${sale.id}`);
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
        title="Sales"
        primaryButton={
          <Button
            buttonStyle="primary"
            leftIcon={<FaLocationArrow size={10} />}
            onClick={() => history.push('/sales/create')}
          >
            Add Sale
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
            {sales?.length ? (
              sales.map((sale) => {
                return (
                  <Table.Row
                    key={sale.id}
                    onClick={
                      sale.customer.nic
                        ? () => handleClickSale(sale)
                        : undefined
                    }
                  >
                    <Table.Cell>
                      <Grid
                        gridAutoFlow="column"
                        gridGap="8px"
                        justifyContent="start"
                        alignItems="center"
                      >
                        <div>
                          <Text.Body fontWeight="semibold">
                            {sale.customer.firstName}
                          </Text.Body>
                          <Text.Body fontWeight="semibold">
                            {sale.customer.lastName}
                          </Text.Body>
                        </div>
                      </Grid>
                    </Table.Cell>
                    <Table.Cell>
                      <Grid
                        gridAutoFlow="column"
                        gridGap="8px"
                        justifyContent="start"
                        alignItems="center"
                      >
                        <div>
                          <Text.Body fontWeight="semibold">
                            Total - Rs.{sale.totalPrice.toFixed(2)}
                          </Text.Body>
                          <Text.Body fontWeight="semibold">
                            Initial - Rs.{sale.instalmentPlan.initialPayment}
                          </Text.Body>
                          {sale.cancelled ? (
                            <Text.Body
                              color={theme.colors.red}
                              fontWeight="semibold"
                            >
                              Cancelled
                            </Text.Body>
                          ) : null}
                        </div>
                      </Grid>
                    </Table.Cell>
                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        {sale?.customer?.nic}
                      </Text.Body>
                      <Text.Body>{sale?.customer?.phone}</Text.Body>
                    </Table.Cell>

                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        Updated: {dayjs(sale.dateUpdated).format('DD/MM/YY')}
                      </Text.Body>
                      <Text.Body>
                        Created: {dayjs(sale.dateCreated).format('DD/MM/YY')}
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
