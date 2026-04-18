import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    // Sort events by date ascending
    const events = await Event.find().sort({ date: 1 }).lean();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const newEvent = await Event.create(body);
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 400 });
  }
}
