import { registerEnumType } from '@nestjs/graphql';

export enum PaginationSort {
  Asc = 'Asc',
  Desc = 'Desc',
}
registerEnumType(PaginationSort, { name: 'PaginationSort' });
