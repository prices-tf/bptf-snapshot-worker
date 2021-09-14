export interface Config {
  port: number;
  bptfAccessToken: string;
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
  tf2Skin: string;
  tf2Schema: string;
  tf2Snapshot: string;
}

export default (): Config => {
  return {
    port:
      process.env.NODE_ENV === 'production'
        ? 3000
        : parseInt(process.env.PORT, 10),
    bptfAccessToken: process.env.BPTF_ACCESS_TOKEN,
    queue: {
      isSentinel: process.env.QUEUE_IS_SENTINEL === 'true',
      host: process.env.QUEUE_HOST,
      port: parseInt(process.env.QUEUE_PORT, 10),
      password: process.env.QUEUE_PASSWORD,
      set: process.env.QUEUE_SET,
    },
    services: {
      tf2Schema: process.env.TF2_SCHEMA_SERVICE_URL,
      tf2Snapshot: process.env.TF2_SNAPSHOT_SERVICE_URL,
      tf2Skin: process.env.TF2_SKIN_SERVICE_URL,
    },
  };
};
