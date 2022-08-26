import { IntegrationType } from '@hm/sdk';
import { ManageMarketplaceFilter } from '@src/components/pages/manage/manage-marketplace.component';
import {
  integrationData,
  ManageMarketplaceIntegrationItemModel,
  ManageSection,
} from '@src/components/templates';
import { isIntegrationActive } from '@src/util/integrations';
import { useMarketplaceApp, useMarketplaceApps, useUser } from '@src/xhr/query';
import React, { useMemo } from 'react';
import { ManageMarketplaceIntegrationTile } from './manage-marketplace-integration-tile.component';

interface Props {
  title: string;
  description: string;
  onClickIntegration: (item: ManageMarketplaceIntegrationItemModel) => void;
  filter: ManageMarketplaceFilter;
}

export const ManageMarketplaceSection: React.FC<Props> = ({
  title,
  description,
  onClickIntegration,
  filter,
}) => {
  const { data: user } = useUser();

  const { data: developerApp } = useMarketplaceApp(
    { where: { developer: user?.id } },
    !!user?.developer
  );

  const { data: marketplaceAppsData } = useMarketplaceApps({
    enabled: true,
    live: true,
  });

  const integrations = useMemo(() => {
    const apps = [...integrationData];

    if (marketplaceAppsData) {
      const marketplaceApps = [...marketplaceAppsData];

      apps.unshift(
        ...marketplaceApps.map((app) => ({
          ...app,
          slug: app.name,
          available: true,
          provider: app.name,
          type: app.type as IntegrationType,
        }))
      );
    }

    if (
      developerApp &&
      marketplaceAppsData &&
      !marketplaceAppsData.find((app) => app.id === developerApp.id)
    ) {
      apps.unshift({
        ...developerApp,
        slug: developerApp.name,
        available: true,
        provider: developerApp.name,
        type: developerApp.type as IntegrationType,
      });
    }

    return apps.filter(({ type, provider }) => {
      return filter === ManageMarketplaceFilter.Connected
        ? type === title && isIntegrationActive(provider)
        : type === title;
    });
  }, [developerApp, filter, marketplaceAppsData, title]);

  if (!integrations.length) {
    return null;
  }

  return (
    <ManageSection title={title} description={description}>
      <>
        {integrations.map((integration) => {
          return (
            <ManageMarketplaceIntegrationTile
              key={integration.provider}
              integration={integration}
              onClickIntegration={() => onClickIntegration(integration)}
            />
          );
        })}
      </>
    </ManageSection>
  );
};
