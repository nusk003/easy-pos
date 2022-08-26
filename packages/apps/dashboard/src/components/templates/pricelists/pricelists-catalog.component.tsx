import { Pricelist, PricelistDeliveryType } from '@hm/sdk';
import { Button, toast, Tooltip } from '@src/components/atoms';
import { CatalogSidebarWrapper } from '@src/components/molecules';
import { PricelistToggle } from '@src/components/organisms';
import {
  Header,
  PricelistsCatalogItemSidebar,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { usePricelistStore } from '@src/store';
import { usePreventUnload } from '@src/util/hooks';
import { sdk } from '@src/xhr/graphql-request';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AiOutlineTags } from 'react-icons/ai';
import { MdCloudUpload } from 'react-icons/md';
import { useHistory } from 'react-router';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';
import { PricelistsCatalogCategorySidebar } from './pricelists-catalog-category-sidebar.component';
import { PricelistsCatalogTable } from './pricelists-catalog-table.component';

const SWrapper = styled.div`
  padding: 32px;
  padding-right: 16px;
  padding-top: 0;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    padding-right: 0;
    padding-top: 0;
  }
`;

const STagIcon = styled(AiOutlineTags)`
  user-select: none;
  cursor: pointer;
`;

interface Props {
  pricelist: Pricelist;
}

export const PricelistsCatalog: React.FC<Props> = ({ pricelist }) => {
  const history = useHistory();

  const [publishLoading, setPublishLoading] = useState(false);

  const {
    catalog,
    setCatalog,
    itemSidebar,
    setItemSidebar,
    categorySidebar,
    setCategorySidebar,
    isCatalogChanges,
    setIsCatalogChanges,
  } = usePricelistStore(
    useCallback(
      (state) => ({
        catalog: state.pricelistsCatalog,
        setCatalog: state.setPricelistsCatalog,
        itemSidebar: state.pricelistsItemSidebar,
        setItemSidebar: state.setPricelistsItemSidebar,
        categorySidebar: state.pricelistsCategorySidebar,
        setCategorySidebar: state.setPricelistsCategorySidebar,
        isCatalogChanges: state.isCatalogChanges,
        setIsCatalogChanges: state.setIsCatalogChanges,
      }),
      []
    )
  );

  usePreventUnload(isCatalogChanges);

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCatalog(pricelist.catalog || { categories: [], labels: [] });
    setCategorySidebar({ category: undefined, visible: false });
    setIsCatalogChanges(false);
  }, [pricelist.catalog, setCatalog, setCategorySidebar, setIsCatalogChanges]);

  const handlePublish = async () => {
    setPublishLoading(true);
    const toastId = toast.loader(`Publishing "${pricelist.name}"`);
    try {
      await sdk.updatePricelist({
        where: { id: pricelist.id },
        data: { catalog },
      });

      toast.update(toastId, `Successfully published "${pricelist.name}"`);
    } catch (error) {
      toast.update(toastId, `Unable to publish "${pricelist.name}"`);
    }
    setPublishLoading(false);
  };

  const isDiscount = useMemo(() => {
    const discount = pricelist.promotions?.discounts?.[0];

    return (
      discount?.delivery?.some(
        (d) => d.type === PricelistDeliveryType.Room && d.enabled
      ) ||
      discount?.delivery?.some(
        (d) => d.type === PricelistDeliveryType.Table && d.enabled
      )
    );
  }, [pricelist.promotions?.discounts]);

  const dropdownButtons = useMemo(() => {
    const buttons = [
      {
        title: 'Manage',
        onClick: () =>
          history.push('/manage/food-beverage/menu', { pricelist }),
      },
    ];

    buttons.push({
      title: !pricelist.promotions?.discounts
        ? 'Add a discount'
        : 'Manage discount',
      onClick: () => history.push('/pricelists/discounts', { pricelist }),
    });

    return buttons;
  }, [history, pricelist]);

  useEffect(() => {
    return () => {
      setCategorySidebar({ visible: false });
      setItemSidebar({ visible: false });
    };
  }, [setCategorySidebar, setItemSidebar]);

  if (!catalog) {
    return null;
  }

  return (
    <>
      <Prompt
        message="Leave page? Changes that you have may not be saved."
        when={isCatalogChanges}
      />

      <Header
        title={pricelist.name}
        indicator={
          <>
            <PricelistToggle pricelist={pricelist} />
            {isDiscount ? (
              <Tooltip message={pricelist.promotions!.discounts![0].name}>
                <STagIcon
                  onClick={() =>
                    history.push('/pricelists/discounts', { pricelist })
                  }
                  color={theme.textColors.blue}
                  size="22px"
                />
              </Tooltip>
            ) : null}
          </>
        }
        dropdownButtons={dropdownButtons}
        primaryButton={
          <Button
            buttonStyle="primary"
            onClick={handlePublish}
            loading={publishLoading}
            leftIcon={<MdCloudUpload />}
            disabled={publishLoading}
          >
            Publish
          </Button>
        }
      />

      <SWrapper>
        <PricelistsCatalogTable
          isPOSAvailable={pricelist.posSettings?.enabled}
          categories={catalog.categories || []}
        />
        <div ref={scrollBottomRef} />
      </SWrapper>

      <CatalogSidebarWrapper visible={!!categorySidebar?.visible}>
        <PricelistsCatalogCategorySidebar key={categorySidebar?.category?.id} />
      </CatalogSidebarWrapper>

      <CatalogSidebarWrapper visible={!!itemSidebar?.visible}>
        <PricelistsCatalogItemSidebar
          key={itemSidebar?.item?.id}
          pricelist={pricelist}
        />
      </CatalogSidebarWrapper>
    </>
  );
};
