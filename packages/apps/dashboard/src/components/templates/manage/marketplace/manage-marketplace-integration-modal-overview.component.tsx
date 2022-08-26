import { IntegrationProvider, IntegrationType, MarketplaceApp } from '@hm/sdk';
import { ReactComponent as IntegrationIcon } from '@src/assets/icons/integration.icon.svg';
import { ReactComponent as VerifiedIcon } from '@src/assets/icons/verified-rounded-icon.svg';
import { Button, Link, Row, Text, toast } from '@src/components/atoms';
import { Card } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { __apaleo_authorize_link__, __root_address__ } from '@src/constants';
import { useStore } from '@src/store';
import {
  IntegrationStatus,
  useIntegrationStatus,
  useIsPMSActive,
} from '@src/util/integrations';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import { color, ColorProps, space, SpaceProps } from 'styled-system';
import { v4 as uuid } from 'uuid';
import { ManageMarketplaceIntegrationItemModel } from './manage-marketplace-integration-data';

const SWrapper = styled.div`
  width: 564px;
  padding: 24px;
`;

const SImageWrapper = styled.div<SpaceProps & ColorProps>`
  width: 80px;
  height: 80px;
  padding: 8px;
  border-radius: 8px;
  display: grid;
  align-items: center;
  border: 1px solid ${theme.colors.gray};
  ${color};
  ${space}
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

interface Props {
  integration:
    | ManageMarketplaceIntegrationItemModel
    | MarketplaceApp
    | undefined;
  onClickSettings: () => void;
  onConnect: () => void | undefined;
  onClose: () => void;
}

export const ManageMarketplaceIntegrationModalOverview: React.FC<Props> = ({
  integration,
  onClickSettings,
  onConnect,
  onClose,
}) => {
  const history = useHistory();
  const { state } = useLocation<{ configure?: boolean }>();

  const { setApaleoState, loggedIn } = useStore(
    useCallback(
      ({ setApaleoState, loggedIn }) => ({ setApaleoState, loggedIn }),
      []
    )
  );

  const provider =
    integration && 'provider' in integration
      ? integration.provider
      : integration?.name;

  const integrationStatus = useIntegrationStatus(provider);

  const isPMSActive = useIsPMSActive();

  const { mutate: mutateHotel } = useHotel(false);

  const handleApaleo = () => {
    const apaleoState = uuid();
    setApaleoState(apaleoState);
    window.open(`${__apaleo_authorize_link__}&state=${apaleoState}`, '_self');
  };

  const handleConnect = async () => {
    if (integration?.type === IntegrationType.Pms && isPMSActive) {
      toast.warn('You cannot connect to more than 1 PMS at once');
      return;
    }

    if (integration && 'connectLink' in integration) {
      if (integration.connectLink.includes(__root_address__)) {
        history.push(integration.connectLink.replace(__root_address__, ''));
      } else {
        window.location.href = integration.connectLink;
      }

      return;
    }

    if (provider === IntegrationProvider.Apaleo) {
      handleApaleo();
    } else if (
      integration?.provider === IntegrationProvider.Mews ||
      integration?.type === IntegrationType.Pos
    ) {
      onConnect();
    }
  };

  const handleDisconnect = async () => {
    if (!integration) {
      return;
    }

    if (integration && 'connectLink' in integration) {
      const toastId = toast.loader('Disconnecting');

      try {
        await sdk.disconnectMarketplaceApp({ id: integration.id });
        await mutateHotel();
        toast.update(toastId, 'Successfully disconnected');
      } catch {
        toast.update(toastId, 'Unable to disconnect');
      }
    }

    if (provider === IntegrationProvider.Apaleo) {
      const toastId = toast.loader('Disconnecting');
      try {
        await sdk.disconnectApaleo();
        await mutateHotel();
        toast.update(toastId, 'Successfully disconnected');
      } catch {
        toast.update(toastId, 'Unable to disconnect');
      }
    } else if (provider === IntegrationProvider.Mews) {
      const toastId = toast.loader('Disconnecting');
      try {
        await sdk.disconnectMews();
        await mutateHotel();
        toast.update(toastId, 'Successfully disconnected');
      } catch {
        toast.update(toastId, 'Unable to disconnect');
      }
    } else {
      const toastId = toast.loader('Disconnecting');
      try {
        await sdk.disconnectOmnivore();
        await mutateHotel();
        toast.update(toastId, 'Successfully disconnected');
      } catch {
        toast.update(toastId, 'Unable to disconnect');
      }
    }
  };

  const isSettingsVisible = useMemo(() => {
    if (integrationStatus === IntegrationStatus.Active) {
      if (provider === IntegrationProvider.Apaleo) {
        return true;
      }

      if (provider === IntegrationProvider.Mews) {
        return true;
      }

      return false;
    }

    return false;
  }, [provider, integrationStatus]);

  const websiteURL = useMemo(() => {
    const regexPattern = new RegExp('(?<=https?://)[a-z.]*');
    return integration?.websiteURL.match(regexPattern)?.[0].replace('www.', '');
  }, [integration?.websiteURL]);

  useEffect(() => {
    if (state?.configure) {
      onClickSettings();
    }
  }, [onClickSettings, state?.configure]);

  return (
    <SWrapper>
      <Row justifyContent="space-between">
        <Row>
          <SImageWrapper
            mr="24px"
            {...(integration &&
              'logoBackgroundColor' in integration &&
              integration?.logoBackgroundColor && {
                backgroundColor: integration.logoBackgroundColor,
              })}
          >
            <img width="100%" src={integration?.logo} />
          </SImageWrapper>
          <div>
            <Text.MediumHeading fontWeight="medium">
              {provider}
            </Text.MediumHeading>
            <Text.Secondary mt="8px" fontWeight="semibold">
              {integration?.type}
            </Text.Secondary>
          </div>
        </Row>
        {integrationStatus === IntegrationStatus.Active ? (
          <Row>
            <VerifiedIcon fill={theme.colors.green} />
            <Text.Interactive ml="8px">Active</Text.Interactive>
          </Row>
        ) : null}
      </Row>
      <Text.Secondary mt="32px" fontWeight="semibold">
        Details
      </Text.Secondary>
      <SLine />
      <Text.Body mt="16px">{integration?.description}</Text.Body>

      <Text.Secondary mt="32px" fontWeight="semibold">
        Pairs with
      </Text.Secondary>
      <SLine />

      {integration?.type === IntegrationType.Pms ? (
        <Card width="242px" mt="16px" cardStyle="white-shadow">
          <Text.BodyBold>Online Check-in</Text.BodyBold>
          <Text.Secondary mt="8px">
            Automatically sync bookings to automate your entire registration
            process
          </Text.Secondary>
        </Card>
      ) : integration?.type === IntegrationType.Pos ? (
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
      {integration?.websiteURL ? (
        <Link
          fontWeight="semibold"
          mt="16px"
          onClick={() => {
            if (integration.websiteURL)
              window.open(integration.websiteURL, '_blank');
          }}
        >
          {websiteURL}
        </Link>
      ) : null}
      {integration?.documentationURL ? (
        <Link
          fontWeight="semibold"
          mt="16px"
          onClick={() => {
            window.open(integration.documentationURL, '_blank');
          }}
        >
          Documentation
        </Link>
      ) : null}
      {integration?.helpURL ? (
        <Link
          fontWeight="semibold"
          mt="16px"
          onClick={() => {
            window.open(integration.helpURL, '_blank');
          }}
        >
          Need help?
        </Link>
      ) : null}

      {integrationStatus === IntegrationStatus.Error ? (
        <Text.Descriptor
          fontWeight="semibold"
          mt="24px"
          color={theme.textColors.red}
        >
          Unable to connect - please disconnect and try to connect again.
        </Text.Descriptor>
      ) : null}

      <SActions>
        <Button buttonStyle="secondary" onClick={() => onClose()}>
          Close
        </Button>
        {isSettingsVisible ? (
          <Button buttonStyle="secondary" onClick={onClickSettings}>
            Configure
          </Button>
        ) : null}

        {loggedIn ? (
          <Button
            disabled={
              integration &&
              'available' in integration &&
              !integration.available
            }
            buttonStyle={
              integrationStatus !== IntegrationStatus.Disabled
                ? 'delete'
                : 'primary'
            }
            leftIcon={
              integrationStatus === IntegrationStatus.Disabled &&
              integration &&
              'available' in integration &&
              integration.available ? (
                <IntegrationIcon fill={theme.colors.white} />
              ) : null
            }
            onClick={
              integrationStatus !== IntegrationStatus.Disabled
                ? handleDisconnect
                : handleConnect
            }
          >
            {integration && 'available' in integration && !integration.available
              ? 'Coming soon'
              : integrationStatus !== IntegrationStatus.Disabled
              ? 'Disconnect'
              : 'Connect'}
          </Button>
        ) : (
          <Button
            buttonStyle="primary"
            leftIcon={<IntegrationIcon fill={theme.colors.white} />}
            onClick={() => history.push('/')}
          >
            Login to connect
          </Button>
        )}
      </SActions>
    </SWrapper>
  );
};
