import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Review from '@/models/Review';

export async function GET() {
  try {
    await dbConnect();
    // Retrieve reviews sorted by newest first
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // We allow public POSTs for reviews so visitors can leave feedback
    await dbConnect();
    const body = await request.json();
    
    // Basic validation
    if (!body.author || !body.content || !body.rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReview = await Review.create({
      author: body.author.substring(0, 50), // Prevent massive names
      content: body.content.substring(0, 500), // Prevent massive spam
      rating: Math.min(Math.max(Number(body.rating), 1), 5) // Lock between 1-5
    });
    
    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create review' }, { status: 400 });
  }
}
