import { Test, TestingModule } from '@nestjs/testing';
import { PricelistService } from './pricelist.service';

describe('PricelistService', () => {
  let service: PricelistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricelistService],
    }).compile();

    service = module.get<PricelistService>(PricelistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
