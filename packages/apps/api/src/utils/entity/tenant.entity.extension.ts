import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { ESField, ESIndex } from '@src/libs/elasticsearch/decorators';
import { Group } from '@src/modules/group/entities';
import { Hotel } from '@src/modules/hotel/entities';
import { Type } from 'class-transformer';
import { SDKObject } from '@src/utils/gql';
import { BaseEntity } from './base.entity.extenstion';

@Entity({ abstract: true })
@Index({ properties: ['hotel', '_id'] })
@ObjectType({ isAbstract: true })
@ESIndex({ abstract: true })
@SDKObject({ abstract: true })
export class TenantBaseEntity extends BaseEntity {
  @ManyToOne(() => Hotel)
  @Index()
  @ESField(() => Hotel, { mappedBy: (hotel) => hotel.id })
  @Type(() => Hotel)
  hotel: Hotel;

  @ManyToOne(() => Group)
  @Index()
  @ESField(() => Group, { mappedBy: (group) => group.id })
  @Type(() => Group)
  group: Group;
}
