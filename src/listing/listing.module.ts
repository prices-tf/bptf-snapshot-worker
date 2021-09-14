import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SkinModule } from '../skin/skin.module';
import { SchemaModule } from '../schema/schema.module';
import { ListingConsumer } from './listing.processor';
import { ListingService } from './listing.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'snapshot',
    }),
    ConfigModule,
    HttpModule,
    SchemaModule,
    SkinModule,
  ],
  providers: [ListingService, ListingConsumer],
})
export class ListingModule {}
