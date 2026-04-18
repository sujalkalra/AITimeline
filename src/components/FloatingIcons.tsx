"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Brain, Network, Code, Database, Sparkles, Bot, Zap, Terminal, Activity } from 'lucide-react';

const icons = [Cpu, Brain, Network, Code, Database, Sparkles, Bot, Zap, Terminal, Activity];

interface IconData {
  Icon: any;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function FloatingIcons() {
  const [placedIcons, setPlacedIcons] = useState<IconData[]>([]);

  useEffect(() => {
    // Generate static random positions on the client immediately after mount
    // This avoids server/client hydration mismatch
    
    const count = 35; // Number of random background icons
    const newIcons = Array.from({ length: count }).map((_, i) => ({
      Icon: icons[i % icons.length], // Rotate through the icons array
      x: Math.random() * 95 + 2, // Map to 2% - 97% width
      y: Math.random() * 95 + 2, // Map to 2% - 97% height
      size: Math.random() * 24 + 16, // Size between 16px and 40px
      delay: Math.random() * 5, // Random animation start delay
      duration: Math.random() * 10 + 10, // Float duration 10-20s
    }));
    
    setPlacedIcons(newIcons);
  }, []);

  if (placedIcons.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {placedIcons.map((data, i) => {
        const { Icon, x, y, size, delay, duration } = data;
        return (
          <motion.div
            key={i}
            className="absolute text-muted-foreground/30"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              y: ["0px", "-30px", "0px"],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          >
            <Icon size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}
