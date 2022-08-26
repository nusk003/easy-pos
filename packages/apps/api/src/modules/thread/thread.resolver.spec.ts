import { Test, TestingModule } from '@nestjs/testing';
import { ThreadResolver } from './thread.resolver';

describe('ThreadResolver', () => {
  let resolver: ThreadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreadResolver],
    }).compile();

    resolver = module.get<ThreadResolver>(ThreadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
