import { Button, toast } from '@src/components/atoms';
import { CatalogSidebarWrapper } from '@src/components/molecules';
import { PointsOfInterestToggle } from '@src/components/organisms';
import { Header } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { usePointsOfInterestStore } from '@src/store/';
import { usePreventUnload } from '@src/util/hooks';
import { sdk } from '@src/xhr/graphql-request';
import { useAttraction } from '@src/xhr/query';
import React, { useCallback, useEffect, useState } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import { useHistory } from 'react-router';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';
import { PointsOfInterestAddCustomPlaceModal } from './points-of-interest-add-custom-place-modal.component';
import { PointsOfInterestCatalogCategorySidebar } from './points-of-interest-catalog-category-sidebar.component';
import { PointsOfInterestCatalogPlaceSidebar } from './points-of-interest-catalog-place-sidebar.component';
import { PointsOfInterestCatalogTable } from './points-of-interest-catalog-table.component';

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

export const PointsOfInterestCatalog: React.FC = () => {
  const history = useHistory();

  const { mutate: mutateAttraction, data: attraction } = useAttraction();

  const [publishLoading, setPublishLoading] = useState(false);

  const {
    catalog,
    setCatalog,
    createPlaceModal,
    setCreatePlaceModal,
    placeSidebar,
    setPlaceSidebar,
    categorySidebar,
    setCategorySidebar,
    isCatalogChanges,
    setIsCatalogChanges,
  } = usePointsOfInterestStore(
    useCallback(
      (state) => ({
        catalog: state.pointsOfInterestCatalog,
        setCatalog: state.setPointsOfInterestCatalog,
        createPlaceModal: state.pointsOfInterestCreatePlaceModal,
        setCreatePlaceModal: state.setPointsOfInterestCreatePlaceModal,
        placeSidebar: state.pointsOfInterestPlaceSidebar,
        setPlaceSidebar: state.setPointsOfInterestPlaceSidebar,
        categorySidebar: state.pointsOfInterestCategorySidebar,
        setCategorySidebar: state.setPointsOfInterestCategorySidebar,
        isCatalogChanges: state.isCatalogChanges,
        setIsCatalogChanges: state.setIsCatalogChanges,
      }),
      []
    )
  );

  usePreventUnload(isCatalogChanges);

  useEffect(() => {
    setCatalog(attraction?.catalog || { categories: [], labels: [] });
    setCategorySidebar({ category: undefined, visible: false });
    setIsCatalogChanges(false);
  }, [attraction, setCatalog, setCategorySidebar, setIsCatalogChanges]);

  const handlePublish = async () => {
    if (catalog && catalog.categories) {
      const toastId = toast.loader('Publishing points of interest');

      setPublishLoading(true);

      try {
        await sdk.updateAttraction({
          data: { catalog },
        });
        toast.update(toastId, 'Successfully published points of interest');
      } catch (error) {
        toast.update(toastId, 'Unable to publish points of interest');
      }

      await mutateAttraction();

      setPublishLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setCategorySidebar({ visible: false });
      setPlaceSidebar({ visible: false });
    };
  }, [setCategorySidebar, setPlaceSidebar]);

  if (!attraction) {
    return null;
  }

  return (
    <>
      <Prompt
        message="Leave page? Changes that you have may not be saved."
        when={isCatalogChanges}
      />

      <Header
        title="Points of Interest"
        indicator={<PointsOfInterestToggle />}
        dropdownButtons={[
          {
            title: 'Manage',
            onClick: () =>
              history.push('/manage/experiences/points-of-interest'),
          },
        ]}
        primaryButton={
          <Button
            loading={publishLoading}
            buttonStyle="primary"
            leftIcon={<MdCloudUpload />}
            onClick={handlePublish}
          >
            Publish
          </Button>
        }
      />

      <SWrapper>
        <PointsOfInterestCatalogTable categories={catalog.categories} />
      </SWrapper>

      <CatalogSidebarWrapper visible={!!categorySidebar?.visible}>
        <PointsOfInterestCatalogCategorySidebar
          key={categorySidebar?.category?.id}
        />
      </CatalogSidebarWrapper>

      <CatalogSidebarWrapper visible={!!placeSidebar?.visible}>
        <PointsOfInterestCatalogPlaceSidebar key={placeSidebar?.place?.id} />
      </CatalogSidebarWrapper>

      <PointsOfInterestAddCustomPlaceModal
        visible={!!createPlaceModal?.visible}
        onClose={() => {
          setCreatePlaceModal({ visible: false });

          setTimeout(() => {
            setCreatePlaceModal(undefined);
          }, 300);
        }}
      />
    </>
  );
};
