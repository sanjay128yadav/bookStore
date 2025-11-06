import { Request, Response } from 'express';
import { Book } from '../models/Book';
import { Review } from '../models/Review';
import mongoose from 'mongoose';

export async function createBook(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { title, author, description } = req.body;
  const book = new Book({ title, author, description, createdBy: new mongoose.Types.ObjectId(userId) });
  await book.save();
  res.status(201).json(book);
}

export async function listBooks(req: Request, res: Response) {
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const page = Math.max(1, Number(req.query.page) || 1);
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'book',
        as: 'reviews'
      }
    },
    {
      $addFields: {
        reviewCount: { $size: '$reviews' },
        avgRating: { $cond: [ { $gt: [ { $size: '$reviews' }, 0 ] }, { $avg: '$reviews.rating' }, null ] }
      }
    },
    { $project: { reviews: 0 } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const results = await Book.aggregate(pipeline).exec();
  res.json({ data: results, page, limit });
}