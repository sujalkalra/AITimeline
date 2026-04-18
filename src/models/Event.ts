import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  year: number;
  date: Date;
  description: string;
  impact: 'Low' | 'Medium' | 'High' | 'Revolutionary';
  category: string;
  image?: string;
  links?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    impact: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Revolutionary'], 
      required: true 
    },
    category: { type: String, required: true },
    image: { type: String },
    links: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: 'AITimeline'
  }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
