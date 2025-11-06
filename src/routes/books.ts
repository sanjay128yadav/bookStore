import { Router } from 'express';
import { createBook, listBooks } from '../controllers/booksController';
import { authMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createBookSchema } from '../validators/book';

const router = Router();
router.get('/', listBooks);
router.post('/', authMiddleware, validateBody(createBookSchema), createBook);
export default router;