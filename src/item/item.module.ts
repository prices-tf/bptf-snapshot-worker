import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemService } from './item.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
