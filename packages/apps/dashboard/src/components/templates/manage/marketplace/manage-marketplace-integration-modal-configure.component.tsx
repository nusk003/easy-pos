import { IntegrationProvider, IntegrationType } from '@hm/sdk';
import { ReactComponent as ConnectArrowIcon } from '@src/assets/icons/bi-direction-connect-arrow-icon.svg';
import HMIcon from '@src/assets/logos/logo-icon.png';
import { Row, Text } from '@src/components/atoms';
import { ManageMarketplaceLogo } from '@src/components/organisms';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ManageMarketplaceIntegrationItemModel } from './manage-marketplace-integration-data';
import { ManageMarketplaceIntegrationModalConfigureFormMews } from './manage-marketplace-integration-modal-configure-form-mews.component';
import { ManageMarketplaceIntegrationModalConfigureFormOmnivore } from './manage-marketplace-integration-modal-configure-form-omnivore.component';

const SWrapper = styled.div`
  padding: 24px;
  width: 564px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface MarketplaceIntegrationConfigureFormProps {
  onClose: () => void;
}

interface Props {
  integration: ManageMarketplaceIntegrationItemModel | undefined;
  onClose: () => void;
}

export const ManageMarketplaceIntegrationModalConfigure: React.FC<Props> = ({
  integration,
  onClose,
}) => {
  const MarketplaceIntegrationConfigureForm: React.FC<MarketplaceIntegrationConfigureFormProps> =
    useMemo(() => {
      if (integration?.provider === IntegrationProvider.Mews) {
        return ManageMarketplaceIntegrationModalConfigureFormMews;
      } else if (integration?.type === IntegrationType.Pos) {
        return ManageMarketplaceIntegrationModalConfigureFormOmnivore;
      }

      return () => null;
    }, [integration?.provider, integration?.type]);

  return (
    <SWrapper>
      <Row>
        <ManageMarketplaceLogo
          ml="12px"
          src={integration?.logo}
          backgroundColor={integration?.logoBackgroundColor}
        />
        <ConnectArrowIcon />
        <ManageMarketplaceLogo mr="12px" src={HMIcon} />
      </Row>
      <Text.Heading mt="32px" fontWeight="medium">
        Connect {integration?.provider} to Hotel Manager
      </Text.Heading>
      <Text.Secondary mt="8px" mb="32px">
        Please provide the following details to integrate with{' '}
        {integration?.provider}
      </Text.Secondary>
      <MarketplaceIntegrationConfigureForm onClose={onClose} />
    </SWrapper>
  );
};
