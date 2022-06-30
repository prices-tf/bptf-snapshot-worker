import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Bottleneck from 'bottleneck';
import Redis from 'ioredis';
import {
  Config,
  LimiterConfig,
  QueueConfig,
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
    const queueConfig = this.configService.get<QueueConfig>('queue');

    let redisConfig: Redis.RedisOptions;

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

    this.limiter = new Bottleneck({
      id: 'bptf',
      clearDatastore: true,
      maxConcurrent:
        this.configService.get<LimiterConfig>('limiter').maxConcurrent,
      minTime: this.configService.get<LimiterConfig>('limiter').minTime,
      datastore: 'ioredis',
      clientOptions: redisConfig,
    });
  }

  onApplicationShutdown(): Promise<void> {
    return this.limiter.disconnect();
  }

  beforeApplicationShutdown(): Promise<void> {
    return this.limiter.stop();
  }
}
