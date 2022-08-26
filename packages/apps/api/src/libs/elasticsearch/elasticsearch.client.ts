import {
  ApiResponse,
  Client,
  ClientOptions,
  RequestParams,
} from '@elastic/elasticsearch';
import { Collection, wrap } from '@mikro-orm/core';
import { __elasticsearch_uri__ } from '@src/constants';
import { Group } from '@src/modules/group/entities';
import { Hotel } from '@src/modules/hotel/entities';
import { Context } from '@src/utils/context';
import axios, { AxiosResponse } from 'axios';
import { ObjectId } from 'mongodb';
import { ESFieldOptions, ShardingStrategy } from './decorators';
import { indices, metadataStorage } from './decorators/storage';

export interface ElasticClientOptions extends ClientOptions {
  node: string;
}

export interface BaseDocument {
  _id: ObjectId | string;
  id: string;
  hotel?: Hotel;
  group?: Group;
}

export interface BulkIndexField {
  _index?: string;
  _id?: string;
}

export interface SearchCollectionBody {
  [key: string]: any;
  sort?: Record<string, any> | Array<any>;
  limit?: number;
  offset?: number;
  query?: any;
}

export type ElasticBody = any;

export class ElasticClient extends Client {
  node: string;

  hotel?: string;

  constructor(context?: Context, node?: string) {
    super({
      node: node || __elasticsearch_uri__,
    });
    this.node = node || __elasticsearch_uri__;

    this.hotel = <string | undefined>context?.req.headers['hotel-id'];
  }

  setHotel(hotel: string) {
    this.hotel = hotel;
  }

  private parseValueFromDecorator = async (
    documentValue: unknown,
    type: ESFieldOptions<any> | string
  ) => {
    let value: any;

    if (documentValue === undefined) {
      return;
    }

    if (typeof type === 'string') {
      value = documentValue;
    } else if (type.fields) {
      if ('loadItems' in <Collection<unknown, unknown>>documentValue) {
        const nestedDocuments = (await (<Collection<unknown, unknown>>(
          documentValue
        )).loadItems()) as Array<Record<string, unknown>>;

        value = nestedDocuments.map((document) => {
          const mappedDocument: Record<string, unknown> = {};

          type.fields!.forEach((field) => {
            mappedDocument[<string>field] = document[<string>field];
          });

          return mappedDocument;
        });
      } else {
        const isInitialized =
          wrap(documentValue) !== undefined &&
          'isInitialized' in wrap(documentValue) &&
          wrap(documentValue).isInitialized();

        console.log(documentValue);
        const nestedDocument = isInitialized
          ? <Record<string, unknown>>documentValue
          : <Record<string, unknown>>await wrap(documentValue).init();

        value = {};

        type.fields.forEach((field) => {
          value[field] = nestedDocument[<string>field];
        });
      }
    } else if (type.isCollection && type.mappedBy) {
      value = (<Collection<unknown>>documentValue).getIdentifiers();
    } else if (type.mappedBy) {
      if (Array.isArray(documentValue)) {
        value = (<Array<Record<string, unknown>>>documentValue).map(
          type.mappedBy
        );
      } else {
        value = type.mappedBy(documentValue);
      }
    }

    return value;
  };

  async createIndices() {
    const promises = Array.from(indices).map(async ([index, options]) => {
      if (!options.abstract) {
        const create = this.indices.create;
        let body: Parameters<typeof create>[0]['body'] = {};

        if (options.shardingStrategy === ShardingStrategy.Group) {
          body = { mappings: { _routing: { required: true } } };
        }

        await create({
          index: index,
          body,
        });
      }
    });

    return Promise.all(promises);
  }

  async createAliases(hotels: Hotel[]): Promise<AxiosResponse<ApiResponse>> {
    const actions: {
      add: {
        index: string;
        alias: string;
        filter: { term: { hotel: string } };
        routing: string;
      };
    }[] = [];

    hotels.forEach((hotel) => {
      indices.forEach((options, index) => {
        if (options.shardingStrategy === ShardingStrategy.Group) {
          actions.push({
            add: {
              index: index,
              alias: `${hotel.id}_${index}`,
              filter: { term: { hotel: hotel.id } },
              routing: hotel.group.id,
            },
          });
        }
      });
    });

    const response = await axios.post(`${this.node}/_aliases`, {
      actions,
    });

    return response;
  }

  async deleteAliases(
    aliases: Array<{ hotel: string; index: string }>
  ): Promise<void[]> {
    return Promise.all(
      aliases.map(async ({ hotel, index }) => {
        await this.indices.deleteAlias({
          index,
          name: hotel,
        });
      })
    );
  }

  async indexOne<T extends BaseDocument>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    index: Function & { prototype: T },
    document: T,
    queryOpts?: Omit<RequestParams.Index, 'index' | 'body' | 'id'>
  ) {
    if (!document.id) {
      throw new Error('Invalid document. Must provide an id field');
    }

    const hotel = document.hotel;

    const indexName = index.name.toLowerCase();

    const body: Partial<T> = {};

    const loadBody = Array.from(metadataStorage.get(indexName) || []).map(
      async ([key, type]) => {
        if (typeof type === 'object' && type.getter) {
          return;
        }
        const documentValue = document[<keyof T>key];
        const value = await this.parseValueFromDecorator(documentValue, type);
        body[<keyof T>key] = value;
      }
    );

    await Promise.all(loadBody);

    delete body.id;

    const indexOptions = indices.get(indexName);

    if (indexOptions?.shardingStrategy === ShardingStrategy.Group) {
      if (!this.hotel && !hotel) {
        throw new Error('Invalid document. Must provide a hotel field');
      }

      return this.index({
        refresh: 'wait_for',
        id: document.id,
        index: `${this.hotel || hotel?.id}_${indexName}`,
        body,
        ...queryOpts,
      });
    }

    return this.index({
      refresh: 'wait_for',
      id: document.id,
      index: `${indexName}`,
      body,
      ...queryOpts,
    });
  }

  async indexMany<T extends BaseDocument>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    index: Function & { prototype: T },
    collection: Array<T>
  ) {
    const indexName = index.name.toLowerCase();
    const indexOptions = indices.get(indexName);

    const body: Array<{ index: BulkIndexField } | T> = [];

    const loadBody = collection.map(async (document) => {
      const elasticDocument: Partial<T> = {};

      const loadElasticDocuments = Array.from(
        metadataStorage.get(indexName) || []
      ).map(async ([key, type]) => {
        if (typeof type === 'object' && type.getter) {
          return;
        }

        const documentValue = document[<keyof T>key];
        const value = await this.parseValueFromDecorator(documentValue, type);
        elasticDocument[<keyof T>key] = value;
      });

      await Promise.all(loadElasticDocuments);

      const indexField: BulkIndexField = { _id: elasticDocument.id };
      delete elasticDocument.id;

      if (indexOptions?.shardingStrategy === ShardingStrategy.Group) {
        const hotel = document.hotel;
        if (!this.hotel && !hotel) {
          throw new Error('Invalid document. Must provide a hotel field');
        }
        indexField._index = `${this.hotel || hotel?.id}_${indexName}`;
      } else {
        indexField._index = indexName;
      }

      body.push({ index: indexField });
      body.push(<T>elasticDocument);
    });

    await Promise.all(loadBody);

    if (!body.length) {
      return;
    }

    return this.bulk({ refresh: 'wait_for', body });
  }

  async deleteOne<T extends BaseDocument>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    index: Function & { prototype: T },
    document: T
  ) {
    const indexName = index.name.toLowerCase();
    const indexOptions = indices.get(indexName);

    const hotel = document.hotel;

    if (indexOptions?.shardingStrategy === ShardingStrategy.Group) {
      if (!this.hotel && !hotel) {
        throw new Error('Invalid document. Must provide a hotel field');
      }

      return this.delete({
        id: document.id,
        index: `${this.hotel || hotel?.id}_${indexName}`,
        refresh: 'wait_for',
      });
    } else {
      return this.delete({
        id: document.id,
        index: indexName,
        refresh: 'wait_for',
      });
    }
  }

  async nativeSearch<T extends BaseDocument>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    index: Function & { prototype: T },
    body: RequestParams.Search['body']
  ) {
    const indexName = index.name.toLowerCase();
    const indexOptions = indices.get(indexName);

    if (body.body) {
      const { body: searchBody, ...rest } = body;
      body = { ...searchBody, ...rest };
    }

    if (indexOptions?.shardingStrategy === ShardingStrategy.Group) {
      if (!this.hotel) {
        throw new Error(
          'Invalid method pipeline. Must call setHotel before nativeSearch.'
        );
      }

      return this.search({
        index: `${this.hotel}_${indexName}`,
        body,
      });
    } else {
      return this.search({
        index: indexName,
        body,
      });
    }
  }

  parseToGql<T extends BaseDocument>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    index: Function & { prototype: T },
    response: any
  ) {
    const indexName = index.name.toLowerCase();

    const dateFields: string[] = [];
    const getters: Array<[string, ESFieldOptions<T>['getter']]> = [];
    Array.from(metadataStorage.get(indexName) || []).map(
      async ([key, type]) => {
        if (type === 'Date') {
          dateFields.push(key);
        }

        if (typeof type === 'object' && type.getter) {
          getters.push([key, type.getter]);
        }
      }
    );

    const data = response.body.hits.hits
      .map((document: any) => ({
        id: document._id,
        ...document._source,
      }))
      .map((document: any) => {
        dateFields.forEach((field) => {
          document[field] = document[field]
            ? new Date(document[field])
            : document[field];
        });

        getters.forEach(([field, getter]) => {
          document[field] = getter!(document);
        });

        return document;
      });

    return {
      data,
      count: response.body.hits.total.value,
    };
  }

  async searchCollection<T extends BaseDocument>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    index: Function & { prototype: T },
    body: SearchCollectionBody
  ): Promise<{ data: Array<T>; count: number }> {
    const { sort, limit, offset, query } = body;

    const searchBody: RequestParams.Search['body'] = {};

    let sortKey = Object.keys(sort || {})[0];
    sortKey = sortKey === 'id' ? '_id' : sortKey;

    searchBody.sort = sort
      ? ['_score', { [sortKey]: Object.values(sort)[0] }]
      : ['_score', { dateCreated: 'desc' }];
    searchBody.from = offset ?? 0;
    searchBody.size = limit ?? 50;
    searchBody.query = query;

    const response = await this.nativeSearch(index, searchBody);
    return this.parseToGql(index, response);
  }
}
