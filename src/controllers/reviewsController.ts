import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review';
import { Book } from '../models/Book';

export async function createReview(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { bookId, rating, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid bookId' });
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const review = new Review({ book: book._id, author: new mongoose.Types.ObjectId(userId), rating, text });
  await review.save();
  res.status(201).json(review);
}

export async function voteReview(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { reviewId, vote } = req.body as { reviewId: string; vote: number };

  if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).json({ message: 'Invalid reviewId' });
  const review = await Review.findById(reviewId);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  const existingIdx = review.votes.findIndex(v => v.user.toString() === userId);
  if (existingIdx === -1) {
    review.votes.push({ user: new mongoose.Types.ObjectId(userId), vote });
  } else {
    const existing = review.votes[existingIdx];
    if (existing.vote === vote) {
      review.votes.splice(existingIdx, 1);
    } else {
      review.votes[existingIdx].vote = vote;
    }
  }

  await review.save();
  const upvotes = review.votes.filter(v => v.vote === 1).length;
  const downvotes = review.votes.filter(v => v.vote === -1).length;
  res.json({ reviewId: review._id, upvotes, downvotes });
}