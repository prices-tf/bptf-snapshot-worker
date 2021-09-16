import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { LimiterService } from '../limiter/limiter.service';

@Injectable()
export class LimiterHealthIndicator extends HealthIndicator {
  constructor(private readonly limiterService: LimiterService) {
    super();
  }

  isHealthy(key: string): Promise<HealthIndicatorResult> {
    return this.limiterService
      .isHealthy()
      .then(() => {
        return this.getStatus(key, true);
      })
      .catch((err) => {
        throw new HealthCheckError(
          'Limiter check failed',
          this.getStatus(key, false, { message: err.message }),
        );
      });
  }
}
