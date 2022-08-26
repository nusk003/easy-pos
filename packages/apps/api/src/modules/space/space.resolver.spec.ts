import { Test, TestingModule } from '@nestjs/testing';
import { SpaceResolver } from './space.resolver';

describe('SpaceResolver', () => {
  let resolver: SpaceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceResolver],
    }).compile();

    resolver = module.get<SpaceResolver>(SpaceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
