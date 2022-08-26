import { MarketplaceApp } from '@hm/sdk';
import { ReactComponent as IntegrationIcon } from '@src/assets/icons/integration.icon.svg';
import { ReactComponent as VerifiedIcon } from '@src/assets/icons/verified-rounded-icon.svg';
import { Button, Row, Text } from '@src/components/atoms';
import { ManageMarketplaceIntegrationItemModel } from '@src/components/templates';
import { theme } from '@src/components/theme';
import {
  IntegrationStatus,
  useIntegrationStatus,
} from '@src/util/integrations';
import React from 'react';
import styled from 'styled-components';
import { color, ColorProps, space, SpaceProps } from 'styled-system';

const SRow = styled(Row)`
  max-width: 352px;
  ${theme.mediaQueries.tablet} {
    max-width: 100%;
  }
`;

const SImageWrapper = styled.div<ColorProps & SpaceProps>`
  width: 55px;
  height: 55px;
  padding: 8px;
  border-radius: 8px;
  display: grid;
  align-items: center;
  border: 1px solid ${theme.colors.gray};

  ${color};
  ${space};
`;

interface Props {
  integration: ManageMarketplaceIntegrationItemModel | MarketplaceApp;
  onClickIntegration?: () => void;
}

export const ManageMarketplaceIntegrationTile: React.FC<Props> = ({
  integration,
  onClickIntegration,
}) => {
  const provider =
    'provider' in integration ? integration.provider : integration.name;

  const integrationStatus = useIntegrationStatus(provider);

  return (
    <SRow justifyContent="space-between">
      <Row>
        <SImageWrapper
          mr="16px"
          backgroundColor={
            'logoBackgroundColor' in integration
              ? integration.logoBackgroundColor
              : undefined
          }
        >
          <img width="100%" src={integration.logo} />
        </SImageWrapper>
        <div>
          <Text.BodyBold pr="8px">{provider}</Text.BodyBold>
        </div>
      </Row>
      <Button
        leftIcon={
          integrationStatus === IntegrationStatus.Active ? (
            <VerifiedIcon fill={theme.colors.green} />
          ) : (
            <IntegrationIcon fill={theme.textColors.gray} />
          )
        }
        onClick={onClickIntegration}
        buttonStyle="secondary"
      >
        {integrationStatus === IntegrationStatus.Active
          ? 'Active'
          : integrationStatus === IntegrationStatus.Error
          ? 'Action required'
          : 'Connect'}
      </Button>
    </SRow>
  );
};
