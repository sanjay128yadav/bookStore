import Joi from 'joi';

export const createBookSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  author: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(2000).optional()
});