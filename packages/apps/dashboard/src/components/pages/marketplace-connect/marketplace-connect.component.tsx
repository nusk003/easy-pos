import { IntegrationType } from '@hm/sdk';
import { ReactComponent as ConnectArrowIcon } from '@src/assets/icons/bi-direction-connect-arrow-icon.svg';
import HMIcon from '@src/assets/logos/logo-icon.png';
import { Button, Link, Row, Text, toast } from '@src/components/atoms';
import { Card } from '@src/components/molecules';
import { ManageMarketplaceLogo } from '@src/components/organisms';
import { theme } from '@src/components/theme';
import { sdk } from '@src/xhr/graphql-request';
import { useMarketplaceApp } from '@src/xhr/query';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  background: #f2f2f2;
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
  grid-template-columns: min(450px, 100%);
`;

const SContentWrapper = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 16px;
`;

const SLine = styled.hr`
  border: 0.5px solid ${theme.colors.lightGray};
  margin-top: 8px;
`;

const SActions = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: right;
  grid-gap: 8px;
  margin-top: 32px;
`;

export const MarketplaceConnect: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const urlSearchParams = new URLSearchParams(location.search);
  const marketplaceAppId = urlSearchParams.get('marketplace_id');
  const redirectURL = urlSearchParams.get('redirect_url');

  const { data: marketplaceApp } = useMarketplaceApp({
    where: { id: marketplaceAppId },
    enabled: true,
  });

  const websiteURL = useMemo(() => {
    const regexPattern = new RegExp('(?<=https?://)[a-z.]*');
    return marketplaceApp?.websiteURL
      .match(regexPattern)?.[0]
      .replace('www.', '');
  }, [marketplaceApp?.websiteURL]);

  const connectMarketplaceApp = async () => {
    if (!marketplaceAppId || !redirectURL) {
      toast.warn(`Unable to connect to ${marketplaceApp!.name}`);
      return;
    }

    try {
      const { connectMarketplaceApp } = await sdk.connectMarketplaceApp({
        id: marketplaceAppId,
        redirectURL,
      });

      window.location.href = connectMarketplaceApp.redirectURL;
    } catch {
      toast.warn(`Unable to connect to ${marketplaceApp!.name}`);
    }
  };

  if (!marketplaceApp) {
    return <SWrapper />;
  }

  return (
    <SWrapper>
      <SContentWrapper>
        <Row justifyContent="center">
          <ManageMarketplaceLogo mr="12px" src={marketplaceApp?.logo} />
          <ConnectArrowIcon />
          <ManageMarketplaceLogo ml="12px" src={HMIcon} />
        </Row>

        <Text.Heading mt="32px" fontWeight="medium" textAlign="center">
          Connect {marketplaceApp.name} to Hotel Manager
        </Text.Heading>

        <Text.Secondary mt="32px" fontWeight="semibold">
          Details
        </Text.Secondary>
        <SLine />
        <Text.Body mt="16px">{marketplaceApp.description}</Text.Body>

        <Text.Secondary mt="32px" fontWeight="semibold">
          Pairs with
        </Text.Secondary>
        <SLine />

        {marketplaceApp.type === IntegrationType.Pms ? (
          <Card width="242px" mt="16px" cardStyle="white-shadow">
            <Text.BodyBold>Online Check-in</Text.BodyBold>
            <Text.Secondary mt="8px">
              Automatically sync bookings to automate your entire registration
              process
            </Text.Secondary>
          </Card>
        ) : marketplaceApp.type === IntegrationType.Pos ? (
          <Card width="242px" mt="16px" cardStyle="white-shadow">
            <Text.BodyBold>Orders</Text.BodyBold>
            <Text.Secondary mt="8px">
              Automatically sync menus and orders from the app to automate order
              fulfilment
            </Text.Secondary>
          </Card>
        ) : null}
        <Text.Secondary mt="32px" fontWeight="semibold">
          More
        </Text.Secondary>
        <SLine />
        {marketplaceApp.websiteURL ? (
          <Link
            fontWeight="semibold"
            mt="16px"
            onClick={() => {
              if (marketplaceApp.websiteURL)
                window.open(marketplaceApp.websiteURL, '_blank');
            }}
          >
            {websiteURL}
          </Link>
        ) : null}
        {marketplaceApp.documentationURL ? (
          <Link
            fontWeight="semibold"
            mt="16px"
            onClick={() => {
              window.open(marketplaceApp.documentationURL, '_blank');
            }}
          >
            Documentation
          </Link>
        ) : null}
        {marketplaceApp.helpURL ? (
          <Link
            fontWeight="semibold"
            mt="16px"
            onClick={() => {
              window.open(marketplaceApp.helpURL, '_blank');
            }}
          >
            Need help?
          </Link>
        ) : null}

        <SActions>
          <Button buttonStyle="secondary" onClick={() => history.replace('/')}>
            Cancel
          </Button>

          <Button buttonStyle="primary" onClick={connectMarketplaceApp}>
            Connect
          </Button>
        </SActions>
      </SContentWrapper>
    </SWrapper>
  );
};
