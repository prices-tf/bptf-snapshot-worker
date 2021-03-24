export interface Config {
  port: number;
  bptfApiKey: string;
  queue: QueueConfig;
  services: Services;
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
}

export default (): Config => {
  return {
    port:
      process.env.NODE_ENV === 'production'
        ? 3000
        : parseInt(process.env.PORT, 10),
    bptfApiKey: process.env.BPTF_API_KEY,
    queue: {
      isSentinel: process.env.QUEUE_IS_SENTINEL === 'true',
      host: process.env.QUEUE_HOST,
      port: parseInt(process.env.QUEUE_PORT, 10),
      password: process.env.QUEUE_PASSWORD,
      set: process.env.QUEUE_SET,
    },
    services: {
      schema: process.env.SCHEMA_SERVICE_URL,
      listings: process.env.LISTING_SERVICE_URL,
    },
  };
};
