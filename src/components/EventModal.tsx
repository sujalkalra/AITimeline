"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Zap, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface EventModalProps {
  event: any;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/90"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-secondary rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 text-xs font-mono rounded bg-background text-primary">
                {event.category}
              </div>
              <div className="px-3 py-1 flex items-center gap-1 text-xs font-mono rounded bg-background text-foreground">
                <Zap size={14} className="text-primary" />
                {event.impact} Impact
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 pt-0 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-foreground mb-2">
                {event.title}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                <Calendar size={16} />
                <span>{format(new Date(event.date), 'MMMM do, yyyy')}</span>
              </div>
            </div>

            {event.image && (
              <div className="w-full h-48 sm:h-64 rounded bg-background overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground font-mono">
                {event.description}
              </p>
            </div>

            {event.links && event.links.length > 0 && (
              <div className="pt-6">
                <h3 className="text-sm font-mono text-muted-foreground mb-3 tracking-widest uppercase">
                  External Resources
                </h3>
                <div className="flex flex-wrap gap-3">
                  {event.links.map((link: string, idx: number) => (
                    <a
                      key={idx}
                      href={link.startsWith('http') ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded bg-background hover:bg-muted transition-colors text-sm font-mono text-foreground"
                    >
                      <ExternalLink size={16} className="text-primary" />
                      {link.replace(/^https?:\/\//, '')}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
