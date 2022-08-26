import { Order, PricelistDeliveryType } from '@hm/sdk';
import { Link, Text } from '@src/components/atoms';
import { Inputs, StarRating, Table } from '@src/components/molecules';
import {
  Header,
  OrdersModal,
  PricelistsReviewsRatings,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import {
  getReadableOrderStatus,
  getReadablePaymentMethod,
} from '@src/util/orders';
import { usePricelistFeedback, useSpaces } from '@src/xhr/query';
import * as CountryCodes from 'country-code-info';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const SWrapper = styled.div`
  padding: 32px;
  padding-right: 16px;
  padding-bottom: 0;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    padding-right: 0;
    padding-bottom: 0;
  }
`;

const SPricelistFeebackRatingWrapper = styled.div`
  padding: 16px;
  max-width: 420px;
  border: 0.5px solid #f4f4f4;
  border-radius: 8px;
`;

interface FormValues {
  pricelistId: string;
}

export const PricelistsReviews: React.FC = () => {
  const history = useHistory();

  const { data: spaces } = useSpaces();

  const pricelists = useMemo(() => {
    return spaces?.flatMap((s) => s.pricelists);
  }, [spaces]);

  const pricelistsSelect = useMemo(() => {
    return (
      pricelists?.map((pricelist) => ({
        label: pricelist.name,
        value: pricelist.id,
      })) || ['Loading']
    );
  }, [pricelists]);

  const [pricelistId, setPricelistId] = useState<string>();
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order>();

  const pricelist = useMemo(() => {
    return pricelists?.find((p) => p.id === pricelistId);
  }, [pricelistId, pricelists]);

  const { data: pricelistFeedback } = usePricelistFeedback(pricelistId);

  const formMethods = useForm<FormValues>();

  const handleSelectPricelistId = (formValues: FormValues) => {
    setPricelistId(formValues.pricelistId);
  };

  useEffect(() => {
    if (pricelists?.length && !pricelistId) {
      setPricelistId(pricelists[0].id);
    }
  }, [pricelistId, pricelists]);

  if (!spaces) {
    return null;
  }

  return (
    <>
      <Header title="Reviews" />
      <SWrapper>
        {pricelists?.length ? (
          <>
            <Text.Primary fontWeight="semibold" mb="8px">
              Menu
            </Text.Primary>
            <FormContext {...formMethods}>
              <form
                onChange={formMethods.handleSubmit(handleSelectPricelistId)}
              >
                <Inputs.Select name="pricelistId" items={pricelistsSelect} />
              </form>
            </FormContext>

            <Text.Primary fontWeight="semibold" mt="16px">
              Overview
              {pricelistFeedback?.averageRating
                ? `: ${pricelistFeedback?.averageRating}★`
                : null}
            </Text.Primary>
            <Text.Descriptor fontWeight="semibold" mt="2px" mb="8px">
              {pricelistFeedback?.noReviews} reviews
            </Text.Descriptor>

            <SPricelistFeebackRatingWrapper>
              <PricelistsReviewsRatings ratings={pricelistFeedback?.ratings} />
            </SPricelistFeebackRatingWrapper>

            <Text.Primary
              fontWeight="semibold"
              mt="16px"
              mb={
                !pricelist?.feedback && pricelistFeedback?.noReviews
                  ? '4px'
                  : '8px'
              }
            >
              Recent orders
            </Text.Primary>
          </>
        ) : (
          <>
            <Text.Primary fontWeight="semibold" mb="4px">
              What are reviews?
            </Text.Primary>
            <Text.Body mb="16px">
              Guest reviews are a food & beverage feature that allows you to
              collect feedback from guests on their orders. You can enable
              reviews when you set up a menu.
            </Text.Body>
          </>
        )}

        {pricelists?.length &&
        !pricelist?.feedback &&
        pricelistFeedback?.noReviews ? (
          <>
            <Text.Descriptor fontWeight="medium">
              Feedback has been disabled for this menu
            </Text.Descriptor>
            <Link
              onClick={() =>
                history.push('/manage/food-beverage/menu', { pricelist })
              }
              mt="2px"
              mb="8px"
            >
              Enable feedback from the manage menu page {'->'}
            </Link>
          </>
        ) : null}
        <Table.Provider>
          <Table.Body>
            {pricelists?.length && pricelistFeedback?.recentOrders?.length ? (
              pricelistFeedback?.recentOrders.slice(0, 5)?.map((order) => {
                return (
                  <Table.Row
                    key={order.id}
                    onClick={() => {
                      setCurrentOrder(order);
                      setIsOrderModalVisible(true);
                    }}
                  >
                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        <StarRating rating={order.feedback!.rating!} />
                        <Text.Body mt="4px" fontWeight="semibold">
                          #{order.orderReference?.toUpperCase()}
                        </Text.Body>
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
                  <Text.Body fontWeight="semibold" textAlign="center">
                    No reviews for the selected pricelist
                  </Text.Body>
                  {!pricelist?.feedback ? (
                    <Link
                      onClick={() =>
                        history.push('/manage/food-beverage/menu', {
                          pricelist,
                        })
                      }
                      mx="auto"
                      mt="4px"
                    >
                      Enable feedback from the manage menu page {'->'}
                    </Link>
                  ) : null}
                </Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell colSpan={10} noBorder>
                  <Text.Body fontWeight="semibold">
                    You haven&apos;t set up any menus yet
                  </Text.Body>
                  {!pricelist?.feedback ? (
                    <Link
                      onClick={() => history.push('/manage/food-beverage/menu')}
                      mt="4px"
                    >
                      Add a menu +
                    </Link>
                  ) : null}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Provider>
      </SWrapper>

      <OrdersModal
        visible={isOrderModalVisible}
        onClose={() => setIsOrderModalVisible(false)}
        order={currentOrder}
      />
    </>
  );
};
