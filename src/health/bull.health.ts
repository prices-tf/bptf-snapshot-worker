import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { Queue } from 'bull';

@Injectable()
export class BullHealthIndicator extends HealthIndicator {
  constructor(
    @InjectQueue('snapshot')
    private readonly schemaQueue: Queue,
  ) {
    super();
  }

  isHealthy(key: string): Promise<HealthIndicatorResult> {
    return this.schemaQueue.client
      .ping()
      .then(() => {
        return this.getStatus(key, true);
      })
      .catch((err) => {
        throw new HealthCheckError(
          'Bull check failed',
          this.getStatus(key, false, { message: err.message }),
        );
      });
  }
}
