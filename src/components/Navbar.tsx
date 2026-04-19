"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Volume2, VolumeX, Info, User } from 'lucide-react';

export default function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
        }
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleMusic = () => {
    setHasInteracted(true); // User explicitly controlled it
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const action = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: action }), '*');
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <nav className="w-full pt-8 pb-4 px-8 flex flex-col sm:flex-row items-center justify-between z-50">
      {/* Invisible YouTube Player for Loki Green Theme */}
      <iframe 
        ref={iframeRef}
        width="2" 
        height="2" 
        src="https://www.youtube-nocookie.com/embed/yV_76cm2BWU?enablejsapi=1&autoplay=1&loop=1&playlist=yV_76cm2BWU"
        frameBorder="0"
        allow="autoplay"
        className="opacity-0 absolute pointer-events-none"
      />

      <Link href="/" className="flex items-center gap-3 group">
        <div className="text-primary">
          <Terminal size={32} />
        </div>
        <span className="font-mono text-3xl font-bold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
          aitimeline
        </span>
      </Link>
      
      <div className="flex items-center gap-6 mt-4 sm:mt-0">
        <button 
          onClick={toggleMusic}
          className={`${isPlaying ? 'text-primary drop-shadow-[0_0_8px_rgba(226,183,20,0.8)]' : 'text-muted-foreground'} hover:text-foreground transition-all flex items-center gap-2`}
          title="Toggle Loki Theme"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
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
