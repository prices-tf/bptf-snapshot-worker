export interface Config {
  bptfApiKey: string;
  queue: QueueConfig;
  services: Services;
}

export interface QueueConfig {
  host: string;
  port: number;
  password: string;
}

export interface Services {
  schema: string;
  listings: string;
}

export default (): Config => {
  return {
    bptfApiKey: process.env.BPTF_API_KEY,
    queue: {
      host: process.env.QUEUE_HOST,
      port: parseInt(process.env.QUEUE_PORT, 10),
      password: process.env.QUEUE_PASSWORD,
    },
    services: {
      schema: process.env.SCHEMA_SERVICE_URL,
      listings: process.env.LISTING_SERVICE_URL,
    },
  };
};
