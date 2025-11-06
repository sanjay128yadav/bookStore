import express from 'express';
import authRoutes from './routes/auth';
import booksRoutes from './routes/books';
import reviewsRoutes from './routes/reviews';

const app = express();
app.use(express.json());

// This is the base path for the routes defined in authRoutes.
// It means all routes inside authRoutes will start with /api/auth.

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/reviews', reviewsRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;