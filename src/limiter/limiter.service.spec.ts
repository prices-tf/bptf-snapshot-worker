import { Test, TestingModule } from '@nestjs/testing';
import { LimiterService } from './limiter.service';

describe('LimiterService', () => {
  let service: LimiterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LimiterService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LimiterService>(LimiterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
