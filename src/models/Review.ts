import { Schema, model, Document, Types } from 'mongoose';

export interface IVote {
  user: Types.ObjectId;
  vote: number;
}

export interface IReview extends Document {
  book: Types.ObjectId;
  author: Types.ObjectId;
  rating: number;
  text?: string;
  votes: IVote[];
  createdAt: Date;
}

const voteSchema = new Schema<IVote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vote: { type: Number, enum: [1, -1], required: true }
}, { _id: false });

const reviewSchema = new Schema<IReview>({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String },
  votes: { type: [voteSchema], default: [] },
  createdAt: { type: Date, default: () => new Date() }
});

export const Review = model<IReview>('Review', reviewSchema);