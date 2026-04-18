"use client";

import { motion } from 'framer-motion';

interface YearSectionProps {
  year: number;
}

export default function YearSection({ year }: YearSectionProps) {
  return (
    <div className="relative flex-shrink-0 flex items-center justify-center p-8 mx-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-8xl font-black font-mono tracking-tighter text-muted-foreground/20"
      >
        {year}
      </motion.div>
    </div>
  );
}
