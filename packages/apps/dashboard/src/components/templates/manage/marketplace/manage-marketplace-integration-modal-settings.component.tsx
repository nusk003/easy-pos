import { IntegrationProvider } from '@hm/sdk';
import { ReactComponent as ConnectArrowIcon } from '@src/assets/icons/bi-direction-connect-arrow-icon.svg';
import HMIcon from '@src/assets/logos/logo-icon.png';
import { Row, Text } from '@src/components/atoms';
import { ManageMarketplaceLogo } from '@src/components/organisms';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ManageMarketplaceIntegrationItemModel } from './manage-marketplace-integration-data';
import { ManageMarketplaceIntegrationModalSettingsFormApaleo } from './manage-marketplace-integration-modal-settings-form-apaleo.component';
import { ManageMarketplaceIntegrationModalSettingsFormMews } from './manage-marketplace-integration-modal-settings-form-mews.component';

const SWrapper = styled.div`
  padding: 24px;
  width: 564px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  integration: ManageMarketplaceIntegrationItemModel | undefined;
  onClose: () => void;
};

interface MarketplaceIntegrationSettingsFormProps {
  integration: ManageMarketplaceIntegrationItemModel | undefined;
  onClose: () => void;
}

export const ManageMarketplaceIntegrationModalSettings: React.FC<Props> = ({
  integration,
  onClose,
}) => {
  const MarketplaceIntegrationSettingsForm: React.FC<MarketplaceIntegrationSettingsFormProps> =
    useMemo(() => {
      if (integration?.provider === IntegrationProvider.Apaleo) {
        return ManageMarketplaceIntegrationModalSettingsFormApaleo;
      } else if (integration?.provider === IntegrationProvider.Mews) {
        return ManageMarketplaceIntegrationModalSettingsFormMews;
      }

      return () => null;
    }, [integration?.provider]);

  return (
    <SWrapper>
      <Row>
        <ManageMarketplaceLogo mr="12px" src={HMIcon} />
        <ConnectArrowIcon />
        <ManageMarketplaceLogo
          ml="12px"
          backgroundColor={integration?.logoBackgroundColor}
          src={integration?.logo}
        />
      </Row>

      <Text.Heading mt="32px" fontWeight="medium">
        Connect {integration?.provider} to Hotel Manager
      </Text.Heading>

      <Text.Secondary mt="8px" mb="32px">
        Please provide the following details to integrate with{' '}
        {integration?.provider}
      </Text.Secondary>

      <MarketplaceIntegrationSettingsForm
        integration={integration}
        onClose={onClose}
      />
    </SWrapper>
  );
};
