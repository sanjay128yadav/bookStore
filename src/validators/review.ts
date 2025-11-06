import Joi from 'joi';

export const createReviewSchema = Joi.object({
  bookId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  text: Joi.string().max(2000).optional()
});

export const voteSchema = Joi.object({
  reviewId: Joi.string().required(),
  vote: Joi.number().valid(1, -1).required()
});