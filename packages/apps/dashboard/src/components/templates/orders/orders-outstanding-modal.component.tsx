import {
  PaginationSort,
  PaymentType,
  SearchOutstandingOrdersQueryVariables,
} from '@hm/sdk';
import { Link, Text, toast } from '@src/components/atoms';
import { Inputs, Modal } from '@src/components/molecules';
import { getReadablePaymentMethod } from '@src/util/orders';
import { sdk } from '@src/xhr/graphql-request';
import {
  useOutstandingGuests,
  useSearchOutstandingOrders,
  useOutstandingOrdersStatistics,
} from '@src/xhr/query';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  OnSettleOrdersOptions,
  OrdersOutstandingTile,
} from './orders-outstanding-tile.component';

const SWrapper = styled.div`
  display: grid;
  padding: 0 16px;
  width: 460px;
  min-height: 80vh;
  grid-template-rows: max-content;
`;

const SFixedWrapper = styled.div`
  position: sticky;
  background: #fff;
  display: grid;
  gap: 16px;
  padding: 16px;
  top: 0;
`;

const SToggleWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto min-content;
  align-items: center;
`;

const SSortLinks = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  gap: 32px;
`;

const STilesWrapper = styled.div`
  display: grid;
  gap: 16px;
  padding: 0 16px;
  grid-auto-rows: max-content;

  > div:last-child {
    padding-bottom: 16px;
  }
`;

const SResultsText = styled(Text.Descriptor)`
  text-align: center;
`;

interface Props {
  paymentType: PaymentType;
  visible: boolean;
  onClose: () => void;
}

export const OrdersOutstandingModal: React.FC<Props> = ({
  paymentType: initialPaymentType,
  visible,
  onClose,
}) => {
  const { mutate: mutateOutstandingOrdersStatistics } =
    useOutstandingOrdersStatistics(false);

  const [state, setState] = useState<{
    paymentType: PaymentType;
    searchView?: boolean;
  }>({
    paymentType: initialPaymentType,
    searchView: false,
  });

  const [searchQuery, setSearchQuery] =
    useState<SearchOutstandingOrdersQueryVariables>({
      query: undefined,
      paymentType: initialPaymentType,
    });

  const {
    data: outstandingGuests,
    setSize: setOutstandingGuestsSize,
    mutate: mutateOutstandingGuests,
    error: outstandingGuestsError,
  } = useOutstandingGuests(
    {
      paymentType: state.paymentType,
    },
    !state.searchView
  );

  const {
    data: outstandingOrders,
    isValidating: searchLoading,
    setSize: setOutstandingOrdersSize,
    count: outstandingOrdersCount,
    mutate: mutateOutstandingOrders,
    mutateCount: mutateOutstandingOrdersCount,
  } = useSearchOutstandingOrders(searchQuery, state.searchView);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleSearch = _.debounce(async (query) => {
    if (!query) {
      setSearchQuery((s) => ({ ...s, query: undefined }));
      setState((s) => ({ ...s, searchView: false }));
      return;
    }

    setSearchQuery((s) => ({ ...s, query, paymentType: undefined }));
    setState((s) => ({ ...s, searchView: true }));
  }, 1000);

  const handleLoadOrders = _.debounce(
    () => {
      if (state.searchView) {
        setOutstandingOrdersSize((s) => s + 1);
      } else {
        setOutstandingGuestsSize((s) => s + 1);
      }
    },
    300,
    { leading: true, trailing: false }
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      handleLoadOrders();
    }
  };

  const handleTogglePaymentType = (paymentType: PaymentType) => {
    setState((s) => ({ ...s, paymentType }));
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (visible) {
      setState((s) => ({
        ...s,
        paymentType: initialPaymentType,
        searchView: false,
      }));
      setSearchQuery({
        query: undefined,
      });
    }
  }, [initialPaymentType, visible]);

  const handleSettleOrders = async ({
    outstandingGuest,
    outstandingOrder,
    paymentType,
    setOutstandingGuestOrders,
  }: OnSettleOrdersOptions) => {
    try {
      if (outstandingGuest) {
        mutateOutstandingGuests((guests) => {
          if (!guests) {
            return guests;
          }

          return [
            guests
              .flat()
              .filter((g) => g.guest.id !== outstandingGuest.guest.id),
          ];
        }, false);

        await sdk.settleOrders({
          guestId: outstandingGuest.guest.id,
          paymentType,
        });

        toast.info(
          `Settled all of ${outstandingGuest.guest.firstName} ${
            outstandingGuest.guest.lastName
          }'s oustanding ${getReadablePaymentMethod(
            paymentType
          ).toLowerCase()} payments`
        );
      } else if (outstandingOrder) {
        if (setOutstandingGuestOrders) {
          setOutstandingGuestOrders((orders) => {
            orders = orders.filter((o) => o.id !== outstandingOrder.id);

            if (!orders.length) {
              mutateOutstandingGuests((guests) => {
                if (!guests) {
                  return guests;
                }

                return [
                  guests
                    .flat()
                    .filter((g) => g.guest.id !== outstandingOrder.guest.id),
                ];
              }, false);
            }

            return orders;
          });
        } else {
          mutateOutstandingOrders((orders) => {
            if (!orders) {
              return orders;
            }

            return [orders.flat().filter((o) => o.id !== outstandingOrder.id)];
          }, false);

          mutateOutstandingOrdersCount((count) => count - 1);
        }

        await sdk.settleOrders({ orderId: outstandingOrder.id });

        toast.info(
          `Settled Order #${outstandingOrder.orderReference?.toUpperCase()}`
        );
      }
    } catch {
      if (outstandingOrder) {
        mutateOutstandingOrders();
        mutateOutstandingOrdersCount((count) => count + 1);
      } else if (outstandingGuest) {
        mutateOutstandingGuests();
      }

      toast.warn('Unable to process request');
    }

    await mutateOutstandingOrdersStatistics();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      onScroll={handleScroll}
      ref={modalRef}
    >
      <SWrapper>
        <SFixedWrapper>
          <Text.Heading>Outstanding Orders</Text.Heading>
          <Inputs.BasicText
            name="outstanding-orders-search"
            search
            searchLoading={searchLoading}
            placeholder="Search guest, room or order number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearch(e.target.value);
            }}
            style={{ borderRadius: 32 }}
          />
          {!searchLoading &&
          state.searchView &&
          !outstandingOrders?.flat?.()?.length ? (
            <SResultsText>
              No results for{' '}
              <Text.BoldDescriptor>{searchQuery.query}</Text.BoldDescriptor>
            </SResultsText>
          ) : (
            <SToggleWrapper>
              {state.searchView && !searchLoading ? (
                <SResultsText textAlign="center">
                  Showing {outstandingOrders?.flat?.()?.length} of{' '}
                  {outstandingOrdersCount} results for{' '}
                  <Text.BoldDescriptor>{searchQuery.query}</Text.BoldDescriptor>
                </SResultsText>
              ) : (
                <SSortLinks>
                  <Link
                    linkStyle={
                      state.paymentType === PaymentType.Cash ? 'black' : 'blue'
                    }
                    onClick={() => handleTogglePaymentType(PaymentType.Cash)}
                    disableOnClick={false}
                    interactive
                  >
                    Paid in person
                  </Link>
                  <Link
                    linkStyle={
                      state.paymentType === PaymentType.RoomBill
                        ? 'black'
                        : 'blue'
                    }
                    onClick={() =>
                      handleTogglePaymentType(PaymentType.RoomBill)
                    }
                    disableOnClick={false}
                    interactive
                  >
                    Added to room bill
                  </Link>
                </SSortLinks>
              )}
            </SToggleWrapper>
          )}
        </SFixedWrapper>
        <STilesWrapper>
          {state.searchView
            ? outstandingOrders?.flat?.()?.map((outstandingOrder) => {
                return (
                  <OrdersOutstandingTile
                    paymentType={state.paymentType}
                    onSettleOrders={handleSettleOrders}
                    outstandingOrder={outstandingOrder}
                    key={outstandingOrder.id}
                  />
                );
              })
            : !outstandingGuestsError
            ? outstandingGuests?.flat?.()?.map((outstandingGuest) => {
                return (
                  <OrdersOutstandingTile
                    paymentType={state.paymentType}
                    onSettleOrders={handleSettleOrders}
                    outstandingGuest={outstandingGuest}
                    key={outstandingGuest.guest.id}
                  />
                );
              })
            : null}
        </STilesWrapper>
      </SWrapper>
    </Modal>
  );
};
