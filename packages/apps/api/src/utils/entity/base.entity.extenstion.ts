import {
  Entity,
  EventArgs,
  EventSubscriber,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Subscriber,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { ESField, ESIndex } from '@src/libs/elasticsearch/decorators';
import { InternalError } from '@src/utils/errors';
import { SDKField, SDKObject } from '@src/utils/gql';
import { IsOptional, validate } from 'class-validator';
import { ObjectId } from 'mongodb';

export interface BaseEntityOptions {
  enableHotelStream?: boolean;
  validate?: boolean;
}

export type BaseEntityConstructorArgs = ConstructorParameters<
  typeof BaseEntity
>;

@Entity({ abstract: true })
@ObjectType({ isAbstract: true })
@ESIndex({ abstract: true })
@SDKObject({ abstract: true })
@Subscriber()
export class BaseEntity implements EventSubscriber {
  @PrimaryKey()
  _id: ObjectId;

  @SerializedPrimaryKey()
  @PrimaryKey()
  @ESField()
  @Field()
  @SDKField()
  id: string;

  @Property({ type: Date })
  @ESField(() => Date)
  @Field(() => Date)
  @SDKField(() => Date)
  dateCreated = new Date();

  @Property({ nullable: true })
  @IsOptional()
  @ESField()
  @Field({ nullable: true })
  @SDKField()
  deleted?: boolean;

  @Property({ type: Date, onUpdate: () => new Date() })
  @ESField(() => Date)
  @Field(() => Date)
  @SDKField(() => Date)
  dateUpdated = new Date();

  options: BaseEntityOptions = {
    enableHotelStream: true,
    validate: true,
  };

  constructor(opts?: BaseEntityOptions) {
    if (opts?.enableHotelStream !== undefined) {
      this.options.enableHotelStream = opts.enableHotelStream;
    }
    if (opts?.validate !== undefined) {
      this.options.validate = opts.validate;
    }
  }

  disableValidation() {
    this.options.validate = false;
  }

  disableHotelStream() {
    this.options.enableHotelStream = false;
  }

  createEntity(entity: any) {
    if (entity) {
      Object.assign(this, JSON.parse(JSON.stringify(entity)));
    }
  }

  async beforeCreate(args: EventArgs<any>) {
    if (args.entity.options?.validate) {
      const errors = await validate(args.changeSet!.entity);
      if (errors.length) {
        throw new InternalError(errors);
      }
    }
  }
}
