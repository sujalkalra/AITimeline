"use client";

import { useState, useEffect } from 'react';
import { Star, Code, ExternalLink, Send } from 'lucide-react';

interface Review {
  _id: string;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
}

export default function FooterReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({ author: '', content: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Failed to fetch reviews", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setFormData({ author: '', content: '', rating: 5 });
        fetchReviews(); // Refresh the list
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full min-h-screen py-24 flex flex-col items-center justify-center border-t border-secondary bg-transparent relative z-10 px-4">
      
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Loki & Author Profile */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8 sticky top-32">
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-50 blur-lg rounded-full group-hover:opacity-100 transition duration-500"></div>
            <img 
              src="https://i.pinimg.com/736x/80/ff/dd/80ffdd46f71d41fa962a3667d5069c75.jpg" 
              alt="Cartoon Loki" 
              className="relative w-64 h-64 object-cover rounded-full border-4 border-background drop-shadow-[0_0_15px_rgba(226,183,20,0.5)]"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-mono text-foreground tracking-tight">
              Crafted by <span className="text-primary">Sujal Kalra</span>
            </h2>
            <p className="text-muted-foreground font-mono leading-relaxed max-w-sm">
              Glorious purpose. Building elegant digital timelines and upscaling the AI narrative chunk by chunk.
            </p>
            
            <a 
              href="https://github.com/sujalkalra" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-white hover:text-black text-foreground font-mono font-bold tracking-widest rounded transition-all duration-300"
            >
              <Code size={20} />
              GITHUB PROFILE
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </div>

        {/* Right Column: Reviews System */}
        <div className="flex flex-col space-y-12">
          
          {/* Add Review Form */}
          <div className="bg-secondary/50 backdrop-blur-md border border-secondary p-8 rounded-lg">
            <h3 className="text-2xl font-mono font-bold text-foreground mb-6 flex items-center gap-2">
              <Star className="text-primary fill-primary" /> Leave a Review
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  required 
                  placeholder="Your Name (e.g. TVA Agent)" 
                  value={formData.author} 
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="flex-1 px-4 py-3 bg-background border-none rounded text-foreground font-mono focus:ring-1 focus:ring-primary"
                />
                <select 
                  value={formData.rating} 
                  onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                  className="w-24 px-4 py-3 bg-background border-none rounded text-primary font-mono focus:ring-1 focus:ring-primary appearance-none text-center"
                >
                  <option value="5">5 ★</option>
                  <option value="4">4 ★</option>
                  <option value="3">3 ★</option>
                  <option value="2">2 ★</option>
                  <option value="1">1 ★</option>
                </select>
              </div>
              <textarea 
                required 
                placeholder="What did you think of the timeline?" 
                rows={4}
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-3 bg-background border-none rounded text-foreground font-mono focus:ring-1 focus:ring-primary resize-none"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background font-mono font-bold tracking-widest rounded hover:bg-white transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'SUBMITTING...' : 'POST REVIEW'} <Send size={18} />
              </button>
            </form>
          </div>

          {/* Render Reviews Feed */}
          <div className="space-y-6">
            <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase opacity-80">
              Community Voices ({reviews.length})
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-secondary rounded text-muted-foreground font-mono text-sm">
                  No reviews yet. Be the first!
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="p-6 bg-background rounded border border-secondary transition-hover hover:border-primary/50 relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-mono font-bold text-foreground flex items-center gap-2">
                        {review.author}
                      </div>
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-primary" : "text-muted opacity-30"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                      "{review.content}"
                    </p>
                    <div className="absolute top-4 right-4 text-[10px] text-muted-foreground/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
