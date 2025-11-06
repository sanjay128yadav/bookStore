import { Router } from 'express';
import { createReview, voteReview } from '../controllers/reviewsController';
import { authMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createReviewSchema, voteSchema } from '../validators/review';

const router = Router();
router.post('/', authMiddleware, validateBody(createReviewSchema), createReview);
router.post('/vote', authMiddleware, validateBody(voteSchema), voteReview);
export default router;