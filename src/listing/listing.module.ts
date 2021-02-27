import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from '../item/item.module';
import { ListingConsumer } from './listing.processor';
import { ListingService } from './listing.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'snapshot',
    }),
    ConfigModule,
    HttpModule,
    ItemModule,
  ],
  providers: [ListingService, ListingConsumer],
})
export class ListingModule {}
