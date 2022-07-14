import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  Config,
  RedisConfig,
} from './common/config/configuration';
import { validation } from './common/config/validation';
import { ListingModule } from './listing/listing.module';
import { RedisOptions } from 'ioredis';
import { HealthModule } from './health/health.module';
import { SchemaModule } from './schema/schema.module';
import { SkinModule } from './skin/skin.module';
import { LimiterModule } from './limiter/limiter.module';

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
      useFactory: (configService: ConfigService<Config>) => {
        const redisConfig = configService.get<RedisConfig>('redis');

        let redisOptions: RedisOptions;

        if (redisConfig.isSentinel) {
          redisOptions = {
            sentinels: [
              {
                host: redisConfig.host,
                port: redisConfig.port,
              },
            ],
            name: redisConfig.set,
          };
        } else {
          redisOptions = {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
          };
        }

        return {
          redis: redisOptions,
          prefix: 'bull',
        };
      },
    }),
    HealthModule,
    ListingModule,
    SchemaModule,
    SkinModule,
    LimiterModule,
  ],
})
export class AppModule {}
