import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SkinModule } from '../skin/skin.module';
import { SchemaModule } from '../schema/schema.module';
import { ListingConsumer } from './listing.processor';
import { ListingService } from './listing.service';
import { HttpModule } from '@nestjs/axios';

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
