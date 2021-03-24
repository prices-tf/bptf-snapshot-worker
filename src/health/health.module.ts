import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HealthController } from './health.controller';
import { BullHealthIndicator } from './bull.health';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    TerminusModule,
    BullModule.registerQueue({
      name: 'snapshot',
    }),
  ],
  providers: [BullHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
