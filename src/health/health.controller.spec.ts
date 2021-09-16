import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { BullHealthIndicator } from './bull.health';
import { HealthController } from './health.controller';
import { LimiterHealthIndicator } from './limiter.health';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [
        {
          provide: BullHealthIndicator,
          useValue: {},
        },
        {
          provide: LimiterHealthIndicator,
          useValue: {},
        },
      ],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
