import {
  Pricelist,
  PricelistDeliveryType,
  PricelistDiscount,
  PricelistMultiplierType,
} from '@hm/sdk';
import { Button, Link, Tag, Text, toast, Tooltip } from '@src/components/atoms';
import { Table, Verify } from '@src/components/molecules';
import { Header, PricelistsDiscountModal } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import { sdk } from '@src/xhr/graphql-request';
import { useSpaces } from '@src/xhr/query';
import React, { useMemo, useState } from 'react';
import { AiFillTags } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
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

const SDiscountToggleWrapper = styled.div`
  display: grid;
  justify-content: center;
`;

export const PricelistsDiscounts: React.FC = () => {
  const { state } = useLocation<{ pricelist?: Pricelist }>();

  const { data: spaces, mutate: mutateSpaces } = useSpaces();

  const discountPricelists = useMemo(() => {
    return spaces
      ?.flatMap((s) => {
        return s.pricelists.flatMap((p) => {
          if (p.promotions?.discounts?.length) {
            return p;
          }
        });
      })
      .filter(Boolean) as Pricelist[];
  }, [spaces]);

  const [isDeleteVerifyVisible, setIsDeleteVerifyVisible] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(
    !!state?.pricelist
  );
  const [selectedDiscount, setSelectedDiscount] = useState<PricelistDiscount>();
  const [selectedPricelist, setSelectedPricelist] = useState<
    Pricelist | undefined
  >(state?.pricelist);

  const handleToggleDiscount = (pricelist: Pricelist) => {
    const discount = pricelist.promotions!.discounts![0];

    setSelectedDiscount((s) => {
      if (s?.id === discount.id) {
        return undefined;
      }

      return discount;
    });

    setSelectedPricelist((p) => {
      if (p?.id === pricelist.id) {
        return undefined;
      }

      return pricelist;
    });
  };

  const handleDeleteDiscount = () => {
    if (!discountPricelists || !discountPricelists.length) {
      return false;
    }

    if (!selectedDiscount) {
      toast.warn('Please select at least 1 discount to delete');
      return;
    }

    setIsDeleteVerifyVisible(true);
  };

  const deleteDiscount = async () => {
    const toastId = toast.loader('Deleting discount');

    try {
      await sdk.updatePricelist({
        where: { id: selectedPricelist!.id },
        data: { promotions: { discounts: null } },
      });
      await mutateSpaces();
      toast.update(toastId, 'Discount deleted successfully');
    } catch {
      toast.update(
        toastId,
        'Unable to delete discount. Please try again later.'
      );
    }

    setSelectedDiscount(undefined);
    setSelectedPricelist(undefined);
    setIsDeleteVerifyVisible(false);
  };

  if (!spaces) {
    return null;
  }

  return (
    <>
      <Header
        title="Discounts"
        primaryButton={
          <Button
            buttonStyle="primary"
            leftIcon={<AiFillTags />}
            onClick={() => setIsDiscountModalVisible(true)}
          >
            Add Discount
          </Button>
        }
      />

      <SWrapper>
        <Table.Provider>
          {discountPricelists?.length ? (
            <Table.Header gridGap="16px">
              <Verify
                visible={isDeleteVerifyVisible}
                modal
                type="delete"
                title="Delete Discount"
                message="Are you sure you want to delete this discount?"
                onVerify={deleteDiscount}
                onClose={() => setIsDeleteVerifyVisible(false)}
              >
                <Button buttonStyle="delete" onClick={handleDeleteDiscount}>
                  Delete
                </Button>
              </Verify>
            </Table.Header>
          ) : null}
          <Table.Body>
            {discountPricelists?.length ? (
              discountPricelists?.map((pricelist) => {
                const discount = pricelist.promotions!.discounts![0];

                const isLive =
                  discount?.delivery?.some(
                    (d) => d.type === PricelistDeliveryType.Room && d.enabled
                  ) ||
                  discount?.delivery?.some(
                    (d) => d.type === PricelistDeliveryType.Table && d.enabled
                  );

                const items =
                  pricelist.catalog?.categories.flatMap((c) => c.items) || [];

                return (
                  <Table.Row key={pricelist.id}>
                    <Table.Checkbox
                      selected={selectedDiscount?.id === discount.id}
                      onClick={() => handleToggleDiscount(pricelist)}
                    />
                    <Table.Cell>
                      <Text.Primary fontWeight="semibold">
                        {discount.name}
                      </Text.Primary>
                      <Text.Body mt="2px">
                        {discount.type === PricelistMultiplierType.Percentage
                          ? `${format.percentage(
                              discount.value * 100
                            )} off order
                        total`
                          : format.currency(discount.value)}
                      </Text.Body>
                    </Table.Cell>
                    <Table.Cell>
                      {discount.count ? (
                        <Text.Body color={theme.textColors.lightGray}>
                          Used {discount.count} time
                          {discount.count > 1 ? 's' : ''}
                        </Text.Body>
                      ) : (
                        <Text.Body color={theme.textColors.lightGray}>
                          Not used yet
                        </Text.Body>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Text.Primary>{pricelist.name}</Text.Primary>
                      <Text.Body mt="2px">{pricelist.space.name}</Text.Body>
                    </Table.Cell>
                    <Table.Cell>
                      <Text.Body color={theme.textColors.lightGray}>
                        {items.length > 0 ? items.length : 'No'} item
                        {items.length !== 1 ? 's' : ''}
                      </Text.Body>
                    </Table.Cell>

                    <Table.Cell>
                      <SDiscountToggleWrapper>
                        <Tooltip
                          message={
                            !isLive
                              ? 'Discount has no enabled fulfilment options'
                              : ''
                          }
                        >
                          <Tag tagStyle={isLive ? 'blue' : 'red'}>
                            {isLive ? 'Live' : 'Disabled'}
                          </Tag>
                        </Tooltip>
                      </SDiscountToggleWrapper>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        buttonStyle="secondary"
                        float="right"
                        onClick={() => {
                          setSelectedPricelist(pricelist);
                          setIsDiscountModalVisible(true);
                        }}
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={10} noBorder>
                  <Text.Body fontWeight="semibold">
                    You haven&apos;t set up any discounts yet
                  </Text.Body>

                  <Link
                    onClick={() => {
                      setIsDiscountModalVisible(true);
                    }}
                    mt="4px"
                    disableOnClick={false}
                  >
                    Add a discount +
                  </Link>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Provider>
      </SWrapper>

      <PricelistsDiscountModal
        pricelist={selectedPricelist}
        defaultValues={selectedPricelist?.promotions?.discounts?.[0]}
        onClose={() => {
          setIsDiscountModalVisible(false);
          setTimeout(() => {
            setSelectedPricelist(undefined);
          }, 300);
        }}
        visible={isDiscountModalVisible}
      />
    </>
  );
};
