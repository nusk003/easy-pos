import {
  Order,
  PaginationSort,
  PricelistDeliveryType,
  SearchOrdersQueryVariables,
} from '@hm/sdk';
import { Link, Text } from '@src/components/atoms';
import { Inputs, Table } from '@src/components/molecules';
import { OrdersModal } from '@src/components/templates';
import { format } from '@src/util/format';
import {
  getReadableOrderStatus,
  getReadablePaymentMethod,
} from '@src/util/orders';
import { useSearchOrders, useSpaces } from '@src/xhr/query';
import * as CountryCodes from 'country-code-info';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div``;

export const OrdersAll: React.FC = () => {
  const history = useHistory();

  const { data: spaces } = useSpaces();

  const pricelists = useMemo(() => {
    return spaces?.flatMap((s) => s.pricelists);
  }, [spaces]);

  const location = useLocation<{ guestId: string } | undefined>();

  const [query, setQuery] = useState<SearchOrdersQueryVariables>({
    limit: 6,
    offset: 0,
    query: null,
    startDate: null,
    endDate: null,
  });
  const [orders, setOrders] = useState<Order[]>();
  const [state, setState] = useState({ isOrdersModalVisible: false });
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(
    undefined
  );

  const { data } = useSearchOrders(query);
  const count = data?.count;

  useEffect(() => {
    if (data?.data) {
      setOrders(data.data as Order[]);
    }
  }, [data?.data]);

  const handleSearchQueryChange = _.debounce((searchQuery: string) => {
    searchQuery = searchQuery.replace(/#/g, '');
    setQuery((s) => ({ ...s, query: searchQuery }));
  }, 300);

  const handleSearchDateChange = (date: Date | null) => {
    setQuery((s) => {
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (date) {
        startDate = date.toISOString();
        endDate = dayjs(date).add(1, 'day').toDate().toISOString();
      }

      return { ...s, startDate, endDate };
    });
  };

  const handlePage = (direction: 'next' | 'prev') => {
    if (count === undefined) {
      return;
    }

    setQuery((s) => {
      let offset = s.offset || 0;

      if (direction === 'next' && offset + 6 <= count) {
        offset += 6;
      } else if (direction === 'prev' && offset !== 0) {
        offset -= 6;
      }

      return { ...s, offset };
    });
  };

  useEffect(() => {
    if (location.state?.guestId) {
      setQuery((s) => ({ ...s, searchTerm: location.state?.guestId || '' }));
    }
  }, [location.state]);

  const handleToggleOrdersModal = (order?: Order) => {
    if (!state.isOrdersModalVisible && order) {
      setCurrentOrder(order);
    }
    setState({ ...state, isOrdersModalVisible: !state.isOrdersModalVisible });
  };

  return (
    <>
      <SWrapper>
        <Table.Provider mb="large">
          <Table.Header>
            <Inputs.BasicText
              placeholder="Search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchQueryChange(e.target.value)
              }
              search
              name="allOrdersSearch"
            />
            <Inputs.BasicDate
              onChange={(date) => handleSearchDateChange(date)}
              icon
              clearButton
              name="allOrdersDate"
              placeholder="Date"
            />
          </Table.Header>

          <Table.Body>
            {orders?.length ? (
              orders.map((order) => {
                return (
                  <Table.Row
                    key={order.id}
                    onClick={() => handleToggleOrdersModal(order as Order)}
                  >
                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        #{order.orderReference?.toUpperCase()}
                      </Text.Body>
                    </Table.Cell>
                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        {order.guest.firstName} {order.guest.lastName}{' '}
                        <Text.Body as="span" fontWeight="regular">
                          (
                          {order.delivery === PricelistDeliveryType.Room
                            ? 'Room '
                            : order.delivery === PricelistDeliveryType.Table
                            ? 'Table '
                            : null}
                          {order.roomNumber})
                        </Text.Body>
                      </Text.Body>
                      <Text.Body mt="2px">
                        {order.guest.mobileCountryCode && order.guest.mobile
                          ? `+${
                              CountryCodes.findCountry({
                                a2: order.guest.mobileCountryCode,
                              })?.dial
                            } ${order.guest.mobile}`
                          : undefined}
                      </Text.Body>
                    </Table.Cell>

                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        {order?.space?.name || 'Unknown space'}
                      </Text.Body>
                      <Text.Body mt="2px">
                        {format.currency(order.totalPrice)} (
                        {getReadablePaymentMethod(order.paymentType)})
                      </Text.Body>
                      <Text.Body mt="2px">
                        {order.items.length} item
                        {order.items.length > 1 ? 's' : ''}
                      </Text.Body>
                    </Table.Cell>
                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        {dayjs(order.dateCreated).format(
                          'MMMM DD YYYY, h:mm a'
                        )}
                      </Text.Body>
                      <Text.Body>
                        {getReadableOrderStatus(order as Order)}
                      </Text.Body>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : pricelists?.length ? (
              <Table.Row>
                <Table.Cell colSpan={10}>
                  {pricelists?.length ? (
                    <Text.Body fontWeight="semibold">
                      No results found
                    </Text.Body>
                  ) : null}
                </Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell colSpan={10} noBorder>
                  <Text.Body fontWeight="semibold">
                    You haven&apos;t set up any menus yet
                  </Text.Body>
                  <Link
                    onClick={() => history.push('/manage/food-beverage/menu')}
                    mt="4px"
                  >
                    Add a menu +
                  </Link>
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
      <OrdersModal
        visible={state.isOrdersModalVisible}
        onClose={handleToggleOrdersModal}
        order={currentOrder}
      />
    </>
  );
};
