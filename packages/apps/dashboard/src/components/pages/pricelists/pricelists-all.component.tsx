import { CreatePricelistMutationVariables, Pricelist } from '@hm/sdk';
import { Button, Link, Row, Text, toast, Tooltip } from '@src/components/atoms';
import { Table, Verify } from '@src/components/molecules';
import { PricelistToggle } from '@src/components/organisms';
import { PricelistsDuplicateModal } from '@src/components/organisms/pricelists/pricelists-duplicate-modal.component';
import { Header } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { getAvailabilityText } from '@src/util/spaces';
import { sdk } from '@src/xhr/graphql-request';
import { useSpaces } from '@src/xhr/query';
import React, { useCallback, useMemo, useState } from 'react';
import { AiOutlineTags } from 'react-icons/ai';
import { FaUtensils } from 'react-icons/fa';
import { MdPointOfSale } from 'react-icons/md';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

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

const SPOSIcon = styled(MdPointOfSale)<SpaceProps>`
  ${space}
`;

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

const SPricelistToggleWrapper = styled.div`
  float: right;
`;

export const PricelistsAll: React.FC = () => {
  const history = useHistory();

  const { data: spaces, mutate: mutateSpaces } = useSpaces();

  const pricelists = useMemo(() => {
    return spaces?.flatMap((s) => s.pricelists);
  }, [spaces]);

  const [isDuplicateVerifyVisible, setIsDuplicateVerifyVisible] =
    useState(false);
  const [isDeleteVerifyVisible, setIsDeleteVerifyVisible] = useState(false);

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
  };

  const togglePricelist = (id: string) => {
    setSelectedPricelists((s) => {
      s[id] = s[id] === undefined ? true : !s[id];
      return { ...s };
    });
  };

  const handleDeletePricelists = () => {
    if (!pricelists || !pricelists.length) {
      return false;
    }

    if (!pricelists.find((pricelist) => selectedPricelists[pricelist.id])) {
      toast.warn('Please select at least 1 pricelist to delete');
      return;
    }

    setIsDeleteVerifyVisible(true);
  };

  const deletePricelists = async () => {
    const selectedPricelistIds = Object.entries(selectedPricelists)
      .filter(([_pricelistId, selected]) => selected)
      .map(([pricelistId, _selected]) => ({ id: pricelistId }));

    setSelectedPricelists((s) => {
      selectedPricelistIds.forEach(({ id }) => {
        delete s[id];
      });

      return { ...s };
    });

    const toastId = toast.loader('Deleting menus');

    try {
      await sdk.deletePricelists({ where: selectedPricelistIds });
      await mutateSpaces();
      toast.update(toastId, 'Successfully deleted menus');
      setIsDeleteVerifyVisible(false);
    } catch {
      toast.update(toastId, 'Unable to delete menus');
    }
  };

  const handleDuplicatePricelist = () => {
    if (!pricelists || !pricelists.length) {
      return false;
    }

    if (
      pricelists.filter((pricelist) => selectedPricelists[pricelist.id])
        .length !== 1
    ) {
      toast.warn('Please select 1 menu to duplicate');
      return;
    }

    setIsDuplicateVerifyVisible(true);
  };

  const duplicatePricelist = async (name: string, spaceId: string) => {
    const selectedPricelistId = Object.entries(selectedPricelists).find(
      ([_pricelistId, selected]) => selected
    )?.[0];

    if (!selectedPricelistId) {
      return;
    }

    const pricelist: Partial<Pricelist> = {
      ...pricelists!.find((p) => p.id === selectedPricelistId),
    };

    const toastId = toast.loader(`Duplicating ${pricelist.name} as ${name}`);

    delete pricelist.space;

    try {
      await sdk.createPricelist({
        ...pricelist,
        spaceId,
        name,
        collection: [],
        delivery: [],
      } as CreatePricelistMutationVariables);
      await mutateSpaces();
      setIsDuplicateVerifyVisible(false);
      toast.update(toastId, `Successfully duplicated ${pricelist.name}`);
    } catch {
      toast.update(toastId, `Unable to duplicate ${pricelist.name}`);
    }
  };

  const onSyncPOS = useCallback(async () => {
    const toastId = toast.loader('Syncing...');
    await sdk.resyncPOS();
    toast.update(toastId, 'Successfully synced');
  }, []);

  if (!spaces) {
    return null;
  }

  return (
    <>
      <Header
        title="Menus"
        dropdownButtons={[{ title: 'Sync POS', onClick: onSyncPOS }]}
        primaryButton={
          <Button
            buttonStyle="primary"
            onClick={() => history.push('/manage/food-beverage/menu')}
            leftIcon={<FaUtensils size={12} />}
          >
            Add Menu
          </Button>
        }
      />

      <SWrapper>
        {!spaces?.length ? (
          <>
            <Text.Primary fontWeight="semibold" mb="4px">
              What are menus?
            </Text.Primary>
            <Text.Body mb="16px">
              A menu is a pricelist that is available to guests in-app. A guest
              can order items from a menu, which can either be fulfilled via
              your orders page or using a POS system.
            </Text.Body>
          </>
        ) : null}

        <Table.Provider>
          {pricelists?.length ? (
            <Table.Header gridGap="16px">
              <Table.Checkbox
                selected={isAllPricelistsSelected}
                onClick={() => toggleAllPricelists()}
                noWrapper
              />

              <Button
                ml="16px"
                buttonStyle="secondary"
                onClick={handleDuplicatePricelist}
              >
                Duplicate
              </Button>

              <Verify
                visible={isDeleteVerifyVisible}
                modal
                type="delete"
                title="Delete Menus"
                message="Are you sure you want to delete these menus?"
                onVerify={deletePricelists}
                onClose={() => setIsDeleteVerifyVisible(false)}
              >
                <Button buttonStyle="delete" onClick={handleDeletePricelists}>
                  Delete
                </Button>
              </Verify>
            </Table.Header>
          ) : null}
          <Table.Body>
            {pricelists?.length ? (
              pricelists?.map((pricelist) => {
                const items =
                  pricelist.catalog?.categories.flatMap((c) => c.items) || [];

                return (
                  <Table.Row key={pricelist.id}>
                    <Table.Checkbox
                      selected={selectedPricelists[pricelist.id]}
                      onClick={() => togglePricelist(pricelist.id)}
                    />
                    <Table.Cell>
                      <Row>
                        {pricelist.posSettings?.enabled ? (
                          <SPOSIcon
                            size="18px"
                            mr="4px"
                            color={theme.colors.blue}
                          />
                        ) : null}
                        <Text.Primary fontWeight="semibold">
                          {pricelist.name}
                        </Text.Primary>
                      </Row>
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
                      <SPricelistToggleWrapper>
                        <PricelistToggle pricelist={pricelist} />
                      </SPricelistToggleWrapper>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        buttonStyle="secondary"
                        float="right"
                        onClick={() =>
                          history.push(`/pricelists/${pricelist.id}`)
                        }
                      >
                        Open
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
                    disableOnClick={false}
                  >
                    Add a menu +
                  </Link>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Provider>
      </SWrapper>

      <PricelistsDuplicateModal
        onClose={() => setIsDuplicateVerifyVisible(false)}
        visible={isDuplicateVerifyVisible}
        onSubmit={duplicatePricelist}
      />
    </>
  );
};
