"use client";

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import YearSection from './YearSection';
import EventNode from './EventNode';
import EventModal from './EventModal';

interface TimelineProps {
  events: any[];
}

export default function Timeline({ events }: TimelineProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [scrollRange, setScrollRange] = useState(0);

  // Measure the width of the scroll container to translate exactly by pixels
  // This avoids the fatal `calc()` translation disappearing bug in Framer Motion.
  useEffect(() => {
    const computeRange = () => {
      if (scrollRef.current) {
        setScrollRange(scrollRef.current.scrollWidth - window.innerWidth);
      }
    };
    
    computeRange();
    window.addEventListener("resize", computeRange);
    return () => window.removeEventListener("resize", computeRange);
  }, [events]);

  // Group events by year
  const eventsByYear = events.reduce((acc: any, event: any) => {
    if (!acc[event.year]) acc[event.year] = [];
    acc[event.year].push(event);
    return acc;
  }, {});

  const years = Object.keys(eventsByYear).sort().map(Number);

  // Map vertical scroll of the target container to horizontal translation seamlessly via pixels
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  return (
    <>
      <section ref={targetRef} className="relative h-[500vh] bg-transparent w-full border-t border-b border-white/5">
        {/* Sticky container that stays in the viewport */}
        <div className="sticky top-0 h-screen flex items-center overflow-hidden w-full bg-transparent">
          {/* Base timeline track line that stretches across viewport */}
          <div className="absolute h-[2px] bg-muted-foreground/20 left-0 right-0 z-0"></div>
          
          <motion.div 
            ref={scrollRef}
            style={{ x }} 
            className="flex items-center min-w-max px-[10vw]"
          >
            {years.map((year, yearIndex) => (
              <div key={year} className="flex items-center relative z-10">
                <YearSection year={year} />
                
                <div className="flex items-center gap-32 mx-16">
                  {eventsByYear[year].map((event: any, eventIndex: number) => (
                    <EventNode 
                      key={event._id || eventIndex} 
                      event={event} 
                      index={eventIndex}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* Ending cap */}
            <div className="ml-32 pr-[10vw]">
              <h2 className="text-2xl font-mono text-muted-foreground flex items-center gap-4">
                <span className="w-16 h-[2px] bg-muted-foreground/20" />
                the future
              </h2>
            </div>
          </motion.div>
        </div>
      </section>

      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </>
  );
}
