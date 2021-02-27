import * as Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  QUEUE_HOST: Joi.string().required(),
  QUEUE_PORT: Joi.number().required(),
  QUEUE_PASSWORD: Joi.string().required(),
  SCHEMA_SERVICE_URL: Joi.string().required(),
  LISTING_SERVICE_URL: Joi.string().required(),
});

export { validation };
