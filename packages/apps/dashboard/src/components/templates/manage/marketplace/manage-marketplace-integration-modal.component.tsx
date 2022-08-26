import { Modal } from '@src/components/molecules';
import React, { useEffect, useState } from 'react';
import { ManageMarketplaceIntegrationItemModel } from './manage-marketplace-integration-data';
import { ManageMarketplaceIntegrationModalSettings } from './manage-marketplace-integration-modal-settings.component';
import { ManageMarketplaceIntegrationModalOverview } from './manage-marketplace-integration-modal-overview.component';
import { ManageMarketplaceIntegrationModalConfigure } from './manage-marketplace-integration-modal-configure.component';

interface Props {
  visible: boolean;
  onClose: () => void;
  integration: ManageMarketplaceIntegrationItemModel | undefined;
}

export const ManageMarketplaceIntegrationModal: React.FC<Props> = ({
  visible,
  integration,
  onClose,
}) => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isConfigureVisible, setIsConfigureVisible] = useState(false);

  const handleOpenSettingsModal = () => {
    setIsSettingsVisible(true);
  };

  const handleOpenConfigureModal = () => {
    setIsConfigureVisible(true);
  };

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setIsSettingsVisible(false);
        setIsConfigureVisible(false);
      }, 300);
    }
  }, [visible]);

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        {isSettingsVisible ? (
          <ManageMarketplaceIntegrationModalSettings
            integration={integration}
            onClose={onClose}
          />
        ) : isConfigureVisible ? (
          <ManageMarketplaceIntegrationModalConfigure
            integration={integration}
            onClose={onClose}
          />
        ) : (
          <ManageMarketplaceIntegrationModalOverview
            integration={integration}
            onClose={onClose}
            onClickSettings={handleOpenSettingsModal}
            onConnect={handleOpenConfigureModal}
          />
        )}
      </Modal>
    </>
  );
};
