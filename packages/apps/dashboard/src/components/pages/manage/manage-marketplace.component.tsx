import { IntegrationType } from '@hm/sdk';
import { ReactComponent as VerifyIcon } from '@src/assets/icons/verified-rounded-icon.svg';
import { Button, Link, Row, Title } from '@src/components/atoms';
import { ManageMarketplaceSection } from '@src/components/organisms';
import {
  Header,
  integrationData,
  ManageMarketplaceIntegrationItemModel,
  ManageMarketplaceIntegrationModal,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useAuthorizeApaleo, useIsPMSActive } from '@src/util/integrations';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import HMFullLogo from '@src/assets/logos/logo-full-blue.png';
import { useStore } from '@src/store';

const SHMLogoFull = styled.img`
  padding-top: 16px;
  padding-left: 32px;

  ${theme.mediaQueries.tablet} {
    padding-left: 16px;
  }
`;

const SWrapper = styled.div<{ loggedIn: boolean }>`
  min-height: ${(props) =>
    props.loggedIn ? 'calc(100vh - 141px)' : 'calc(100vh - 192.5px)'};
  overflow-y: ${(props) => (props.loggedIn ? undefined : 'scroll')};
  height: ${(props) => (props.loggedIn ? undefined : '1px')};

  margin-right: -16px;

  background: #fafafa;
  padding: 32px;

  display: grid;
  align-content: start;
  gap: 32px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    min-height: ${(props) =>
      props.loggedIn ? 'calc(100vh - 101px)' : 'calc(100vh - 152.5px)'};
  }
`;

const SHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
`;

const SFilter = styled.div`
  display: grid;
  grid-template-columns: min-content min-content;
  grid-gap: 8px;
`;

const SFilterItem = styled.div<{ selected?: boolean }>`
  padding: 8px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  ${({ selected }) => selected && `background-color: ${theme.colors.lightGray}`}
`;

const SVerifyIcon = styled(VerifyIcon)<SpaceProps>`
  ${space};
`;

export enum ManageMarketplaceFilter {
  All = 'All',
  Connected = 'Connected',
}

export const ManageMarketplace: React.FC = () => {
  const { loggedIn } = useStore(
    useCallback(
      (state) => ({
        loggedIn: state.loggedIn,
      }),
      []
    )
  );

  const history = useHistory();

  const isPMSActive = useIsPMSActive();

  const [filter, setFilter] = useState<ManageMarketplaceFilter>(
    ManageMarketplaceFilter.All
  );

  const [isIntegrationModalVisible, setIsIntegrationModalVisible] =
    useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<
    ManageMarketplaceIntegrationItemModel | undefined
  >(undefined);

  const handleOpenIntegrationModal = (
    integration: ManageMarketplaceIntegrationItemModel
  ) => {
    setIsIntegrationModalVisible(true);
    setCurrentIntegration(integration);
  };

  const handleCloseIntegrationModal = () => {
    history.push('/manage/marketplace');
    setIsIntegrationModalVisible(false);

    setTimeout(() => {
      setCurrentIntegration(undefined);
    }, 300);
  };

  useAuthorizeApaleo();

  useEffect(() => {
    if (window.location.pathname.includes('/manage/marketplace/')) {
      if (!window.location.search) {
        const integrationSlug = window.location.pathname.split('/').pop();
        const integration = integrationData.find(
          (integration) => integration.slug.replace('/', '') === integrationSlug
        );
        setCurrentIntegration(integration);
        setIsIntegrationModalVisible(true);
        history.push('/manage/marketplace');
      }
    }
  }, [history]);

  return (
    <>
      {loggedIn ? (
        <Header backgroundColor="#fafafa" title="Marketplace" />
      ) : (
        <>
          <Title />
          <SHMLogoFull src={HMFullLogo} width="200px" />
          <Header
            title="Marketplace"
            onBack={() => history.push('/')}
            indicator={null}
            primaryButton={
              <Button buttonStyle="primary" onClick={() => history.push('/')}>
                Login
              </Button>
            }
          />
        </>
      )}

      <SWrapper loggedIn={loggedIn}>
        {loggedIn ? (
          <SHeader>
            <SFilter>
              <SFilterItem
                onClick={() => setFilter(ManageMarketplaceFilter.All)}
                selected={filter === ManageMarketplaceFilter.All}
              >
                {ManageMarketplaceFilter.All}
              </SFilterItem>
              {isPMSActive ? (
                <SFilterItem
                  onClick={() => setFilter(ManageMarketplaceFilter.Connected)}
                  selected={filter === ManageMarketplaceFilter.Connected}
                >
                  <Row>
                    <SVerifyIcon mr="8px" fill={theme.colors.green} />
                    {ManageMarketplaceFilter.Connected}
                  </Row>
                </SFilterItem>
              ) : null}
            </SFilter>
            <Link>Missing integration?</Link>
          </SHeader>
        ) : null}

        <ManageMarketplaceSection
          filter={filter}
          onClickIntegration={(integration) =>
            handleOpenIntegrationModal(integration)
          }
          title={IntegrationType.Pms}
          description="Automatically sync guests and bookings to the relevant features (e.g. online check-in, automating your entire registration process)"
        />

        <ManageMarketplaceSection
          filter={filter}
          onClickIntegration={(integration) =>
            handleOpenIntegrationModal(integration)
          }
          title={IntegrationType.Pos}
          description="Instantly deliver in-app orders straight to your POS for seamless operations"
        />

        <ManageMarketplaceIntegrationModal
          visible={isIntegrationModalVisible}
          integration={currentIntegration}
          onClose={handleCloseIntegrationModal}
        />
      </SWrapper>
    </>
  );
};
