import { Test, TestingModule } from '@nestjs/testing';
import { PricelistResolver } from './pricelist.resolver';

describe('PricelistResolver', () => {
  let resolver: PricelistResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricelistResolver],
    }).compile();

    resolver = module.get<PricelistResolver>(PricelistResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
