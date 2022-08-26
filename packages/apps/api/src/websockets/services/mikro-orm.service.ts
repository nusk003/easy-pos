import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { LambdaInternalError } from '@src/utils/errors';

export type ORM = MikroORM<IDatabaseDriver<Connection>> & { em: EntityManager };

let orm: ORM;

export class MikroORMService {
  async init() {
    if (!orm) {
      orm = <ORM>await MikroORM.init(mikroORMConfig());
    }

    return orm;
  }

  getORM() {
    if (!orm) {
      throw new LambdaInternalError(
        'MikroORMService has not been initialized. The init method must be called before retrieving the ORM.'
      );
    }

    return orm;
  }
}
