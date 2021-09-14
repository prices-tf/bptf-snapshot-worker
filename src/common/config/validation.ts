import * as Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  BPTF_ACCESS_TOKEN: Joi.string().required(),
  QUEUE_IS_SENTINEL: Joi.boolean().optional(),
  QUEUE_HOST: Joi.string().required(),
  QUEUE_PORT: Joi.number().required(),
  QUEUE_PASSWORD: Joi.string().optional(),
  QUEUE_SET: Joi.string().optional(),
  TF2_SCHEMA_SERVICE_URL: Joi.string().required(),
  TF2_SNAPSHOT_SERVICE_URL: Joi.string().required(),
  TF2_SKIN_SERVICE_URL: Joi.string().required(),
});

export { validation };
