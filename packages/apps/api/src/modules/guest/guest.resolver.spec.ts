import { Test, TestingModule } from '@nestjs/testing';
import { GuestResolver } from './guest.resolver';

describe('GuestResolver', () => {
  let resolver: GuestResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestResolver],
    }).compile();

    resolver = module.get<GuestResolver>(GuestResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
