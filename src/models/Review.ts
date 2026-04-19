import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  author: string;
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    timestamps: true,
    collection: 'reviews'
  }
);

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
