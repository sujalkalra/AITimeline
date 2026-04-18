import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import { getSession } from '@/lib/auth';
import { mockEvents } from '@/data/timeline';

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Check if the database already has events to avoid duplicates
    const count = await Event.countDocuments();
    if (count > 0) {
      return NextResponse.json({ error: 'Database is already seeded' }, { status: 400 });
    }

    // Strip out _id from mockEvents to allow MongoDB to generate native ObjectIds
    const seedData = mockEvents.map(({ _id, createdAt, updatedAt, ...rest }) => ({
      ...rest,
    }));

    await Event.insertMany(seedData);
    
    return NextResponse.json({ success: true, count: seedData.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to seed database' }, { status: 500 });
  }
}
