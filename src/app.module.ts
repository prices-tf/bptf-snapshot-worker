import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  LimiterConfig,
  QueueConfig,
} from './common/config/configuration';
import { validation } from './common/config/validation';
import { ListingModule } from './listing/listing.module';
import IORedis from 'ioredis';
import { HealthModule } from './health/health.module';
import { SchemaModule } from './schema/schema.module';
import { SkinModule } from './skin/skin.module';

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

        let redisConfig: IORedis.RedisOptions;

        if (queueConfig.isSentinel) {
          redisConfig = {
            sentinels: [
              {
                host: queueConfig.host,
                port: queueConfig.port,
              },
            ],
            name: queueConfig.set,
          };
        } else {
          redisConfig = {
            host: queueConfig.host,
            port: queueConfig.port,
            password: queueConfig.password,
          };
        }

        const limiter = configService.get<LimiterConfig>('limiter');

        return {
          redis: redisConfig,
          prefix: 'bull',
          limiter,
        };
      },
    }),
    HealthModule,
    ListingModule,
    SchemaModule,
    SkinModule,
  ],
})
export class AppModule {}
