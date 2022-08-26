import { Button, Link, Text, Tooltip } from '@src/components/atoms';
import { Table } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { format } from '@src/util/format';
import {
  getAvailabilityText,
  getPricelistStatus,
  PricelistStatus,
} from '@src/util/spaces';
import { useOrders, useSpaces } from '@src/xhr/query';
import React, { useMemo, useState } from 'react';
import { AiOutlineTags } from 'react-icons/ai';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const SWrapper = styled.div``;

const SPromotionWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  align-items: center;
`;

const SPromotionText = styled(Text.Body)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 80px;
`;

interface Props {
  onChange: (selectedPricelists: Record<string, boolean>) => void;
}

export const OrdersPricelistsTable: React.FC<Props> = ({ onChange }) => {
  const history = useHistory();

  const { data: spaces } = useSpaces();
  const { data: orders } = useOrders();

  const pricelists = useMemo(() => {
    return spaces?.flatMap((s) => s.pricelists);
  }, [spaces]);

  const [selectedPricelists, setSelectedPricelists] = useState<
    Record<string, boolean>
  >({});

  const isAllPricelistsSelected = useMemo(() => {
    if (!pricelists || !pricelists.length) {
      return false;
    }

    return !pricelists.some((pricelist) => !selectedPricelists[pricelist.id]);
  }, [pricelists, selectedPricelists]);

  const toggleAllPricelists = () => {
    if (!pricelists) {
      return;
    }

    const newSelectedPricelists: typeof selectedPricelists = {};

    pricelists.forEach(({ id }) => {
      newSelectedPricelists[id] = !isAllPricelistsSelected;
    });

    setSelectedPricelists(newSelectedPricelists);

    onChange(newSelectedPricelists);
  };

  const togglePricelist = (id: string) => {
    setSelectedPricelists((s) => {
      s[id] = s[id] === undefined ? true : !s[id];
      onChange({ ...s });
      return { ...s };
    });
  };

  return (
    <SWrapper>
      <Table.Provider>
        <Table.Header gridGap="16px">
          <Table.Checkbox
            selected={isAllPricelistsSelected}
            onClick={() => toggleAllPricelists()}
            noWrapper
          />
        </Table.Header>
        <Table.Body>
          {pricelists?.length ? (
            pricelists?.map((pricelist) => {
              const items =
                pricelist.catalog?.categories.flatMap((c) => c.items) || [];

              const pricelistStatus = getPricelistStatus(
                pricelist.space,
                pricelist
              );

              const noActiveOrders = orders?.filter(
                (o) => o.pricelist.id === pricelist.id
              ).length;

              return (
                <Table.Row
                  key={pricelist.id}
                  onClick={() => togglePricelist(pricelist.id)}
                >
                  <Table.Checkbox
                    selected={selectedPricelists[pricelist.id]}
                    onClick={() => togglePricelist(pricelist.id)}
                  />

                  <Table.Cell>
                    <Text.Primary fontWeight="semibold">
                      {pricelist.name}
                    </Text.Primary>
                    <Text.Body mt="2px">{pricelist.space.name}</Text.Body>
                  </Table.Cell>
                  <Table.Cell>
                    <Text.Body color={theme.textColors.lightGray}>
                      {items.length > 0 ? items.length : 'No'} item
                      {items.length !== 1 ? 's' : ''}
                    </Text.Body>
                  </Table.Cell>
                  <Table.Cell>
                    <Tooltip
                      message={getAvailabilityText(pricelist.availability)}
                    >
                      <Text.Body
                        fontWeight="semibold"
                        color={theme.textColors.lightGray}
                      >
                        Opening times
                      </Text.Body>
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell>
                    {pricelist.promotions?.discounts?.length ? (
                      <SPromotionWrapper>
                        <AiOutlineTags
                          size={14}
                          color={theme.textColors.blue}
                        />
                        <SPromotionText
                          fontWeight="semibold"
                          color={theme.textColors.blue}
                          maxWidth="200px"
                          ml="4px"
                        >
                          {pricelist.promotions.discounts[0].name}
                        </SPromotionText>
                      </SPromotionWrapper>
                    ) : (
                      <Text.Body
                        color={theme.textColors.lightGray}
                        fontWeight="semibold"
                      >
                        No discount
                      </Text.Body>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Text.Body
                      color={
                        pricelistStatus === PricelistStatus.Live
                          ? theme.textColors.blue
                          : theme.textColors.lightGray
                      }
                      fontWeight="semibold"
                      textAlign="right"
                    >
                      {format.capitalize(pricelistStatus)}
                    </Text.Body>
                  </Table.Cell>
                  <Table.Cell>
                    <Button float="right" buttonStyle="secondary">
                      {!selectedPricelists[pricelist.id] ? 'Review' : 'Hide'}{' '}
                      orders
                      {noActiveOrders ? ` (${noActiveOrders})` : null}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })
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
      </Table.Provider>
    </SWrapper>
  );
};
