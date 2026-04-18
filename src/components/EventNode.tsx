"use client";

import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface EventNodeProps {
  event: any;
  onClick: () => void;
  index: number;
}

export default function EventNode({ event, onClick, index }: EventNodeProps) {
  // Alternate top and bottom based on index
  const isTop = index % 2 === 0;

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      {/* Node Content */}
      <motion.div
        initial={{ opacity: 0, y: isTop ? 20 : -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className={`absolute w-64 p-4 rounded bg-secondary transition-all duration-200 group-hover:bg-muted left-1/2 -translate-x-1/2 ${
          isTop ? 'bottom-full mb-8' : 'top-full mt-8'
        } ${
          event.impact === 'Revolutionary' 
            ? 'ring-2 ring-primary shadow-[0_0_20px_rgba(226,183,20,0.6)] z-20' 
            : 'border border-muted-foreground/50 z-10'
        }`}
      >
        <div className="text-xs font-mono text-primary mb-2">
          {format(new Date(event.date), 'MMM do, yyyy')}
        </div>
        <h3 className="font-mono font-bold text-lg text-foreground mb-2 leading-tight">
          {event.title}
        </h3>
        <p className="text-sm font-mono text-muted-foreground line-clamp-3">
          {event.description}
        </p>
        
        {/* Connector Line */}
        <div className={`absolute left-1/2 -translate-x-1/2 w-[2px] h-8 bg-muted-foreground/30 ${
          isTop 
            ? 'top-full' 
            : 'bottom-full'
        }`} />
      </motion.div>

      {/* Center timeline dot */}
      <motion.div
        whileHover={{ scale: 1.2 }}
        className="w-4 h-4 rounded-full bg-muted-foreground z-10 relative group-hover:bg-primary transition-colors"
      />
    </div>
  );
}
