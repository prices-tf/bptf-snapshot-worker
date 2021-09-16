import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { BullHealthIndicator } from './bull.health';
import { LimiterHealthIndicator } from './limiter.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private bullHealthIndicator: BullHealthIndicator,
    private limiterHealthIndicator: LimiterHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.bullHealthIndicator.isHealthy('queue'),
      () => this.limiterHealthIndicator.isHealthy('limiter'),
    ]);
  }
}
