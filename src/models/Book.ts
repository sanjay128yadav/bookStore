import { Schema, model, Document, Types } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: () => new Date() }
});

export const Book = model<IBook>('Book', bookSchema);