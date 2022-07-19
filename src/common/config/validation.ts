import * as Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  BPTF_ACCESS_TOKEN: Joi.string().required(),
  LIMITER_MAX_CONCURRENT: Joi.number().integer().positive().required(),
  LIMITER_MIN_TIME: Joi.number().integer().default(1000),
  REDIS_IS_SENTINEL: Joi.boolean().optional(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_SET: Joi.string().optional(),
  TF2_SNAPSHOT_SERVICE_URL: Joi.string().required(),
});

export { validation };
