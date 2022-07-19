import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ListingConsumer } from './listing.processor';
import { ListingService } from './listing.service';
import { LimiterModule } from '../limiter/limiter.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'snapshot',
    }),
    ConfigModule,
    HttpModule,
    LimiterModule,
  ],
  providers: [ListingService, ListingConsumer],
})
export class ListingModule {}
