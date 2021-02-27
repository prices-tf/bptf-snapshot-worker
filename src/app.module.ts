import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { QueueConfig } from './common/config/configuration';
import { validation } from './common/config/validation';
import { ListingModule } from './listing/listing.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
      load: [configuration],
      validationSchema: validation,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const queueConfig = configService.get<QueueConfig>('queue');

        return {
          redis: {
            host: queueConfig.host,
            port: queueConfig.port,
            password: queueConfig.password,
          },
          prefix: 'bull',
        };
      },
    }),
    ListingModule,
    ItemModule,
  ],
})
export class AppModule {}
