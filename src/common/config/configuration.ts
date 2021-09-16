export interface Config {
  port: number;
  bptfAccessToken: string;
  limiter: LimiterConfig;
  queue: QueueConfig;
  services: Services;
}

export interface LimiterConfig {
  maxConcurrent: number;
  minTime: number;
}

export interface QueueConfig {
  isSentinel: boolean;
  host: string;
  port: number;
  password?: string;
  set?: string;
}

export interface Services {
  schema: string;
  listings: string;
  skin: string;
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
    queue: {
      isSentinel: process.env.QUEUE_IS_SENTINEL === 'true',
      host: process.env.QUEUE_HOST,
      port: parseInt(process.env.QUEUE_PORT, 10),
      password: process.env.QUEUE_PASSWORD,
      set: process.env.QUEUE_SET,
    },
    services: {
      schema: process.env.TF2_SCHEMA_SERVICE_URL,
      listings: process.env.TF2_SNAPSHOT_SERVICE_URL,
      skin: process.env.TF2_SKIN_SERVICE_URL,
    },
  };
};
