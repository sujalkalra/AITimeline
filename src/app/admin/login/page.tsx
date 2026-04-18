"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid developer code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center relative">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm p-8 bg-secondary rounded"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded text-primary flex items-center justify-center mb-4">
            <Terminal size={32} />
          </div>
          <h1 className="text-2xl font-bold font-mono text-foreground text-center">
            developer
          </h1>
          <p className="text-sm font-mono text-muted-foreground mt-2 text-center">
            enter developer code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="..."
              className="w-full px-4 py-3 rounded bg-background border-none text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary transition-all text-center tracking-widest"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-accent text-sm font-mono text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-background hover:bg-primary hover:text-background text-muted-foreground font-mono transition-colors disabled:opacity-50"
          >
            {loading ? 'auth...' : 'enter'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
