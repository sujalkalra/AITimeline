"use client";

import Link from 'next/link';
import { Terminal, Settings, Info, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full pt-8 pb-4 px-8 flex flex-col sm:flex-row items-center justify-between z-50">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="text-primary">
          <Terminal size={32} />
        </div>
        <span className="font-mono text-3xl font-bold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
          aitimeline
        </span>
      </Link>
      
      <div className="flex items-center gap-6 mt-4 sm:mt-0">
        <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          <Settings size={20} />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          <Info size={20} />
        </button>
        <Link href="/admin/login" className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded font-mono text-xs tracking-widest transition-colors flex items-center gap-2 ml-4">
          DEV_ACCESS
        </Link>
      </div>
    </nav>
  );
}
