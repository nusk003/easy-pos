import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Scope } from '@nestjs/common';
import { NotFoundError } from '@src/utils/errors';
import { BaseService } from '@src/utils/service';
import {
  DeleteMarketplaceAppArgs,
  UpdateMarketplaceAppArgs,
} from './dto/marketplace-app.args';
import { MarketplaceApp } from './marketplace-app.entity';

export interface MarketplaceAppFindOpts {
  live?: boolean;
  enabled?: boolean;
}

@Injectable({ scope: Scope.REQUEST })
export class MarketplaceAppService extends BaseService<MarketplaceApp> {
  constructor(
    @InjectRepository(MarketplaceApp)
    private readonly marketplaceAppRepository: EntityRepository<MarketplaceApp>
  ) {
    super(marketplaceAppRepository);
  }

  async findAll(opts?: MarketplaceAppFindOpts) {
    const queryVariables = opts || {};

    if (!queryVariables?.enabled) {
      delete queryVariables?.enabled;
    }

    if (!queryVariables?.live) {
      delete queryVariables?.live;
    }

    const marketplaceApps = await this.marketplaceAppRepository.find(
      queryVariables
    );
    return marketplaceApps;
  }

  async findOne(id: string, opts?: MarketplaceAppFindOpts) {
    const queryVariables = { id, ...opts };

    if (!queryVariables?.enabled) {
      delete queryVariables?.enabled;
    }

    if (!queryVariables?.live) {
      delete queryVariables?.live;
    }

    const marketplaceApp = await this.marketplaceAppRepository.findOne(
      queryVariables
    );

    return marketplaceApp;
  }

  async findOneByDeveloper(id: string, opts?: MarketplaceAppFindOpts) {
    const queryVariables = { developer: id, ...opts };

    if (!queryVariables?.enabled) {
      delete queryVariables?.enabled;
    }

    if (!queryVariables?.live) {
      delete queryVariables?.live;
    }

    const marketplaceApp = await this.marketplaceAppRepository.findOne(
      queryVariables
    );

    return marketplaceApp;
  }

  async update(updateMarketplaceAppArgs: UpdateMarketplaceAppArgs) {
    const marketplaceApp = await this.findOne(
      updateMarketplaceAppArgs.where.id
    );

    if (!marketplaceApp) {
      throw new NotFoundError(MarketplaceApp, {
        id: updateMarketplaceAppArgs.where.id,
      });
    }

    wrap(marketplaceApp).assign(updateMarketplaceAppArgs.data);
    this.repository.persist(marketplaceApp);
    return marketplaceApp;
  }

  async delete(deleteMarketplaceAppArgs: DeleteMarketplaceAppArgs) {
    const marketplaceApp = await this.findOne(
      deleteMarketplaceAppArgs.where.id
    );

    if (!marketplaceApp) {
      throw new NotFoundError(MarketplaceApp, {
        id: deleteMarketplaceAppArgs.where.id,
      });
    }

    this.repository.remove(marketplaceApp);
    return marketplaceApp;
  }
}
