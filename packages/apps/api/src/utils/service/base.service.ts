import { Primary, QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseService<E> {
  repository: EntityRepository<E>;

  constructor(repository: EntityRepository<E>) {
    this.repository = repository;
  }

  getReference(id: Primary<E>) {
    return this.repository.getReference(id);
  }

  persist(entity: E) {
    return this.repository.persist(entity);
  }

  remove(entity: E) {
    return this.repository.remove(entity);
  }

  async flush() {
    return this.repository.flush();
  }

  createSortArg(sort: Record<string, QueryOrder>) {
    if (!sort) {
      return undefined;
    }

    sort = JSON.parse(JSON.stringify(sort));

    if (sort.id) {
      sort._id = sort.id;
      delete sort.id;
    }

    return sort;
  }
}
