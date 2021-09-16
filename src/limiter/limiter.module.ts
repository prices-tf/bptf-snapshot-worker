import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LimiterService } from './limiter.service';

@Module({
  imports: [ConfigModule],
  providers: [LimiterService],
  exports: [LimiterService],
})
export class LimiterModule {}
