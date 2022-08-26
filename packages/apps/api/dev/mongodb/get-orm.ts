import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';

type ORM = MikroORM<IDatabaseDriver<Connection>> & { em: EntityManager };

export const getORM = async () => {
  const orm = <ORM>await MikroORM.init(mikroORMConfig({ debug: false }));
  return orm;
};
