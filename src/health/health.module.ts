import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HealthController } from './health.controller';
import { BullHealthIndicator } from './bull.health';
import { TerminusModule } from '@nestjs/terminus';
import { LimiterModule } from '../limiter/limiter.module';
import { LimiterHealthIndicator } from './limiter.health';

@Module({
  imports: [
    TerminusModule,
    BullModule.registerQueue({
      name: 'snapshot',
    }),
    LimiterModule,
  ],
  providers: [BullHealthIndicator, LimiterHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
