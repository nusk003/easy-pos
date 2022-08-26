import { Order, OrderStatus } from '@hm/sdk';
import { Badge, Feature, Link, Text } from '@src/components/atoms';
import { OrdersTile } from '@src/components/organisms';
import {
  OrdersModal,
  OrdersOutstandingOverview,
  OrdersPricelistsTable,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { sdk } from '@src/xhr/graphql-request';
import { useOrders } from '@src/xhr/query';
import * as QueryString from 'query-string';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Components, Virtuoso } from 'react-virtuoso';
import styled, { css } from 'styled-components';

const SWrapper = styled.div``;

const SContentWrapper = styled.div``;

const SSwimlanesWrapper = styled.div`
  padding-top: 24px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 36px;

  ${theme.mediaQueries.laptop} {
    grid-template-columns: repeat(8, 1fr);
  }

  ${theme.mediaQueries.tablet} {
    overflow: auto;
    grid-template-columns: 100% 100% 100%;
    padding: 0 16px;
    padding-top: 24px;
    margin: 0 -16px;

    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

interface SSwimlaneProps {
  gridColumn: string;
  hideLaptop?: boolean;
}

const SSwimlaneWrapper = styled.div<SSwimlaneProps>`
  display: grid;
  align-content: baseline;
  grid-column: ${(props): string => props.gridColumn};

  ${theme.mediaQueries.laptop} {
    display: ${(props): string | undefined =>
      props.hideLaptop ? 'none' : undefined};
  }

  ${theme.mediaQueries.tablet} {
    display: grid;
    width: 100%;
    grid-column: unset;
  }
`;

const SToggleActiveHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
`;

const SToggleActive = styled(Link)`
  display: none;

  ${theme.mediaQueries.laptop} {
    display: block;
  }

  ${theme.mediaQueries.tablet} {
    display: none;
  }
`;

const SVirtuosoList = styled(Virtuoso)`
  overflow-y: visible;
  margin: 0 -16px;
  margin-top: 8px;

  ${(props) =>
    props.totalCount !== undefined && props.totalCount > 3
      ? css`
          > div > div > div:last-child {
            padding-bottom: 16px;
          }
        `
      : undefined}

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SOrdersListWrapper = styled.div`
  padding: 16px;

  > div:first-child {
    margin-top: 8px;
  }
`;

const SOrdersPricelistsTableWrapper = styled.div``;

const List: Components['List'] = forwardRef((props, ref) => {
  return <SOrdersListWrapper {...props} ref={ref} />;
});

export const OrdersKanban: React.FC = () => {
  const location = useLocation<{ order: Order }>();
  const history = useHistory();

  const { data } = useOrders();

  const [orders, setOrders] = useState(data);
  const [selectedPricelists, setSelectedPricelists] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (data) {
      if (
        Object.values(selectedPricelists).length &&
        Object.values(selectedPricelists).find((selected) => selected)
      ) {
        const selectedPricelistIds = Object.entries(selectedPricelists)
          .filter(([_pricelistId, selected]) => selected)
          .map(([pricelistId, _selected]) => pricelistId);

        const selectedOrders = data.filter((order) =>
          selectedPricelistIds.includes(order.pricelist.id)
        );

        setOrders(selectedOrders);
      } else {
        setOrders(data);
      }
    }
  }, [data, selectedPricelists]);

  const [state, setState] = useState<{
    isOrdersModalVisible: boolean;
    currentOrder: Order | undefined;
    isActiveVisible: boolean;
  }>({
    isOrdersModalVisible: false,
    currentOrder: undefined,
    isActiveVisible: true,
  });

  const handleResize = useCallback(() => {
    const { innerWidth: width } = window;
    if (
      (!state.isActiveVisible && width > theme.mediaQueries.size.laptop) ||
      width < theme.mediaQueries.size.tablet
    ) {
      setState((s) => ({ ...s, isActiveVisible: true }));
    }
  }, [state.isActiveVisible]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const handleModalClose = () => {
    setState((s) => ({ ...s, isOrdersModalVisible: false }));
  };

  const toggleActive = () => {
    setState((s) => ({ ...s, isActiveVisible: !s.isActiveVisible }));
  };

  useEffect(() => {
    if (location.state?.order && location.state?.order.id) {
      setState((s) => ({
        ...s,
        currentOrder: location.state?.order,
        isOrdersModalVisible: true,
      }));
    }
  }, [location]);

  const [createdOrders, setCreatedOrders] = useState<Order[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!orders) {
      return;
    }

    setCreatedOrders(orders.filter((o) => o.status === OrderStatus.Waiting));
    setApprovedOrders(orders.filter((o) => o.status === OrderStatus.Approved));
    setCompletedOrders(orders.filter((o) => o.status === OrderStatus.Ready));
  }, [orders]);

  const handleOrderClick = (order: Order) => {
    setState((s) => ({
      ...s,
      currentOrder: order,
      isOrdersModalVisible: true,
    }));
  };

  const openOrderModal = useCallback(
    async (id: string) => {
      try {
        const { order } = await sdk.order({ where: { id } });
        history.push('/orders', { order });
      } catch {
        history.push('/orders');
      }
    },
    [history]
  );

  useEffect(() => {
    if (location.search) {
      const { id } = QueryString.parse(location.search);
      if (id) {
        openOrderModal(id as string);
      }
    }
  }, [openOrderModal, location]);

  const swimlaneHeight = useMemo(() => {
    const noTiles = Math.max(
      createdOrders.length,
      approvedOrders.length,
      completedOrders.length
    );

    return Math.max(Math.min(noTiles * 175 + 16, 3 * 175 + 16), 10);
  }, [approvedOrders.length, completedOrders.length, createdOrders.length]);

  if (location.search) {
    return null;
  }

  return (
    <>
      <SWrapper>
        <SContentWrapper>
          <Feature name="outstandingOrders">
            <OrdersOutstandingOverview />
          </Feature>
          {orders?.length ? (
            <SSwimlanesWrapper>
              <SSwimlaneWrapper gridColumn="1 / 5">
                <Text.Heading display="flex" alignContent="center">
                  New
                  <Badge
                    count={createdOrders?.length || 0}
                    bg="altRed"
                    ml="small"
                  />
                </Text.Heading>
                <SVirtuosoList
                  style={{ height: swimlaneHeight }}
                  components={{ List }}
                  totalCount={createdOrders.length}
                  itemContent={(index) => (
                    <OrdersTile
                      order={createdOrders[index]}
                      key={createdOrders[index].id}
                      onClick={handleOrderClick}
                    />
                  )}
                />
              </SSwimlaneWrapper>

              <SSwimlaneWrapper gridColumn="5 / 9">
                <SToggleActiveHeader>
                  <Text.Heading display="flex" alignContent="center">
                    {state.isActiveVisible ? 'Active' : 'Completed'}
                    <Badge
                      count={approvedOrders?.length || 0}
                      bg="blue"
                      ml="small"
                    />
                  </Text.Heading>

                  <SToggleActive disableOnClick={false} onClick={toggleActive}>
                    {state.isActiveVisible ? 'See completed' : 'Hide completed'}
                  </SToggleActive>
                </SToggleActiveHeader>

                {state.isActiveVisible ? (
                  <SVirtuosoList
                    style={{ height: swimlaneHeight }}
                    components={{ List }}
                    totalCount={approvedOrders.length}
                    itemContent={(index) => (
                      <OrdersTile
                        order={approvedOrders[index]}
                        key={approvedOrders[index].id}
                        onClick={handleOrderClick}
                      />
                    )}
                  />
                ) : (
                  <SVirtuosoList
                    style={{ height: swimlaneHeight }}
                    components={{ List }}
                    totalCount={completedOrders.length}
                    itemContent={(index) => (
                      <OrdersTile
                        order={completedOrders[index]}
                        key={completedOrders[index].id}
                        onClick={handleOrderClick}
                      />
                    )}
                  />
                )}
              </SSwimlaneWrapper>

              <SSwimlaneWrapper gridColumn="9 / 13" hideLaptop>
                <Text.Heading>Completed</Text.Heading>

                <SVirtuosoList
                  style={{ height: swimlaneHeight }}
                  components={{ List }}
                  totalCount={completedOrders.length}
                  itemContent={(index) => (
                    <OrdersTile
                      order={completedOrders[index]}
                      key={completedOrders[index].id}
                      onClick={handleOrderClick}
                    />
                  )}
                />
              </SSwimlaneWrapper>
            </SSwimlanesWrapper>
          ) : (
            <Text.Body fontWeight="medium" my="16px">
              You have no active orders
            </Text.Body>
          )}

          <SOrdersPricelistsTableWrapper>
            <OrdersPricelistsTable
              onChange={(pricelists) => setSelectedPricelists(pricelists)}
            />
          </SOrdersPricelistsTableWrapper>
        </SContentWrapper>
        <OrdersModal
          visible={state.isOrdersModalVisible}
          onClose={handleModalClose}
          order={state.currentOrder}
        />
      </SWrapper>
    </>
  );
};
