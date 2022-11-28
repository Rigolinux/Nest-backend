/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  ENVIROMENT: Joi.string(),
  PORT: Joi.number(),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number(),
  DB_NAME: Joi.string(),
  USER_DB: Joi.string().required(),
  USER_DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
