export interface Config {
  port: number;
  bptfAccessToken: string;
  limiter: LimiterConfig;
  redis: RedisConfig;
  services: Services;
}

export interface LimiterConfig {
  maxConcurrent: number;
  minTime: number;
}

export interface RedisConfig {
  isSentinel: boolean;
  host: string;
  port: number;
  password?: string;
  set?: string;
}

export interface Services {
  listings: string;
}

export default (): Config => {
  return {
    port:
      process.env.NODE_ENV === 'production'
        ? 3000
        : parseInt(process.env.PORT, 10),
    bptfAccessToken: process.env.BPTF_ACCESS_TOKEN,
    limiter: {
      maxConcurrent: parseInt(process.env.LIMITER_MAX_CONCURRENT, 10),
      minTime: parseInt(process.env.LIMITER_MIN_TIME, 10),
    },
    redis: {
      isSentinel: process.env.REDIS_IS_SENTINEL === 'true',
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
      set: process.env.REDIS_SET,
    },
    services: {
      listings: process.env.TF2_SNAPSHOT_SERVICE_URL,
    },
  };
};
