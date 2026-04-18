import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import AdminDashboard from '@/components/AdminDashboard';

import { mockEvents } from "@/data/timeline";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }

  let events: any[] = [];
  let isUsingMock = false;
  
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const rawEvents = await Event.find().sort({ date: 1 }).lean();
      events = rawEvents.map(evt => {
        const safeDate = evt.date instanceof Date ? evt.date.toISOString() : new Date(evt.date || Date.now()).toISOString();
        const safeCreated = evt.createdAt instanceof Date ? evt.createdAt.toISOString() : new Date(evt.createdAt || Date.now()).toISOString();
        const safeUpdated = evt.updatedAt instanceof Date ? evt.updatedAt.toISOString() : new Date(evt.updatedAt || Date.now()).toISOString();
        
        return {
          ...evt,
          _id: evt._id?.toString() || Math.random().toString(),
          date: safeDate,
          createdAt: safeCreated,
          updatedAt: safeUpdated,
        };
      });
    } catch (e) {
      console.error("CRITICAL MongoDB Error:", e);
      console.warn("MongoDB fetch failed in admin, using mock data");
    }
  }

  if (!process.env.MONGODB_URI || events.length === 0) {
    events = mockEvents;
    isUsingMock = true;
  }

  return <AdminDashboard initialEvents={events} isUsingMock={isUsingMock} />;
}
