import Timeline from "@/components/Timeline";
import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import { Network } from "lucide-react";
import Link from 'next/link';

import { mockEvents } from "@/data/timeline";

// Revalidate page dynamically
export const dynamic = 'force-dynamic';

export default async function Home() {
  let events: any[] = [];
  
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const rawEvents = await Event.find().sort({ date: 1 }).lean();
      
      events = rawEvents.map(evt => {
        // Defensively handle dates in case they were inserted manually as strings instead of Date objects
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
      console.warn("Failed to fetch events from MongoDB, falling back to mock data");
    }
  }

  // Provide initial mock data if no database is connected yet
  if (!process.env.MONGODB_URI || events.length === 0) {
    events = mockEvents;
  }

  if (events.length === 0) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center w-full min-h-screen relative overflow-hidden bg-background">
        <div className="z-10 flex flex-col items-center bg-secondary p-12 rounded-lg border-none max-w-lg text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <Network size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold font-mono text-foreground mb-4">No Timeline Data Found</h2>
          <p className="text-muted-foreground font-mono mb-8">
            The timeline is currently empty. Login to the developer panel to seed initial AI milestones.
          </p>
          <Link
            href="/admin/login"
            className="px-6 py-3 rounded text-background bg-primary font-mono font-bold tracking-widest transition-colors hover:bg-white"
          >
            OPEN ADMIN PANEL
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full relative flex flex-col bg-transparent">
      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col items-center justify-center relative bg-transparent">
        <div className="absolute left-[3vw] top-1/2 -translate-y-1/2 z-40 pointer-events-none opacity-50 font-mono text-sm tracking-widest text-primary rotate-[-90deg] origin-center hidden sm:block">
          SCROLL DOWN &darr;
        </div>
        
        <div className="text-center px-4 max-w-3xl flex flex-col items-center">
          <h1 className="text-5xl sm:text-7xl font-bold font-mono text-foreground mb-6 tracking-tight">
            the history of ai
          </h1>
          <p className="text-lg font-mono text-muted-foreground leading-relaxed">
            an interactive timeline exploring artificial intelligence from the launch of chatgpt to the era of autonomous agents.
          </p>
          <div className="mt-12 text-muted-foreground animate-bounce">
            &darr;
          </div>
        </div>
      </section>

      {/* The Timeline Canvas */}
      <Timeline events={events} />
      
      {/* Footer / End Section */}
      <section className="w-full h-screen flex flex-col items-center justify-center border-t border-secondary">
        <h2 className="text-3xl font-mono text-foreground">
          to be continued...
        </h2>
      </section>
    </main>
  );
}
