import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Bottleneck from 'bottleneck';
import { RedisOptions } from 'ioredis';
import {
  Config,
  LimiterConfig,
  RedisConfig,
} from '../common/config/configuration';

@Injectable()
export class LimiterService
  implements OnModuleInit, OnApplicationShutdown, BeforeApplicationShutdown
{
  private limiter: Bottleneck = null;

  constructor(private readonly configService: ConfigService<Config>) {}

  isHealthy(): Promise<void> {
    if (this.limiter === null) {
      return Promise.reject('Limiter not ready');
    }

    return this.limiter.ready();
  }

  schedule(fn: any): Promise<any> {
    return this.limiter.schedule(
      {
        expiration: 10000,
      },
      fn,
    );
  }

  onModuleInit(): void {
    const redisConfig = this.configService.get<RedisConfig>('redis');

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

    this.limiter = new Bottleneck({
      id: 'bptf',
      clearDatastore: true,
      maxConcurrent:
        this.configService.get<LimiterConfig>('limiter').maxConcurrent,
      minTime: this.configService.get<LimiterConfig>('limiter').minTime,
      datastore: 'ioredis',
      clientOptions: redisOptions,
    });
  }

  onApplicationShutdown(): Promise<void> {
    return this.limiter.disconnect();
  }

  beforeApplicationShutdown(): Promise<void> {
    return this.limiter.stop();
  }
}
