import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceAppService } from './marketplace-app.service';

describe('MarketplaceAppService', () => {
  let service: MarketplaceAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketplaceAppService],
    }).compile();

    service = module.get<MarketplaceAppService>(MarketplaceAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
