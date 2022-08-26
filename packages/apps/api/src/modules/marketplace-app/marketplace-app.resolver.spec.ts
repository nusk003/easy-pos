import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceAppResolver } from './marketplace-app.resolver';

describe('MarketplaceAppResolver', () => {
  let resolver: MarketplaceAppResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketplaceAppResolver],
    }).compile();

    resolver = module.get<MarketplaceAppResolver>(MarketplaceAppResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
