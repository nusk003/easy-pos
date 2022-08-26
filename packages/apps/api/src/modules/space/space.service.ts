import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { WebhookServiceClient } from '@src/microservices/webhook-service/webhook-service.client';
import { DeletePricelistsArgs } from '@src/modules/pricelist/dto/pricelist.args';
import { Context } from '@src/utils/context/context.type';
import { NotFoundError } from '@src/utils/errors';
import { TenantService } from '@src/utils/service';
import { DeleteSpaceArgs, UpdateSpaceArgs } from './dto/space.args';
import { Space } from './space.entity';

@Injectable({ scope: Scope.REQUEST })
export class SpaceService extends TenantService<Space> {
  webhookServiceClient = new WebhookServiceClient();

  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: EntityRepository<Space>,
    @Inject(CONTEXT) context: Context
  ) {
    super(spaceRepository, context);
  }

  async findAll() {
    const spaces = await this.spaceRepository.find(
      { hotel: this.hotel },
      { populate: ['pricelists'] }
    );
    return spaces;
  }

  async findOne(id: string) {
    const space = await this.spaceRepository.findOne(id, {
      populate: ['pricelists'],
    });
    if (!space) {
      throw new NotFoundError(Space, { id });
    }
    return space;
  }

  async update(updateSpaceArgs: UpdateSpaceArgs) {
    const space = await this.findOne(updateSpaceArgs.where.id);
    wrap(space).assign(updateSpaceArgs.data);
    this.repository.persist(space);
    return space;
  }

  async delete(deleteSpaceArgs: DeleteSpaceArgs) {
    const space = await this.findOne(deleteSpaceArgs.where.id);
    this.repository.remove(space);
    return space;
  }

  async deleteMany(deletePricelistsArgs: DeletePricelistsArgs) {
    const ids = deletePricelistsArgs.where.map((w) => w.id);

    const pricelists = await this.repository.find({ id: ids });

    pricelists.forEach((pricelist) => {
      this.remove(pricelist);
    });
  }
}
