import { Test, TestingModule } from '@nestjs/testing';
import { AttractionResolver } from './attraction.resolver';

describe('AttractionResolver', () => {
  let resolver: AttractionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttractionResolver],
    }).compile();

    resolver = module.get<AttractionResolver>(AttractionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
