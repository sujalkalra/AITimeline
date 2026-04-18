"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function AdminDashboard({ initialEvents, isUsingMock = false }: { initialEvents: any[], isUsingMock?: boolean }) {
  const [events, setEvents] = useState(initialEvents);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: '', year: new Date().getFullYear(), date: new Date().toISOString().split('T')[0],
    description: '', impact: 'Medium', category: 'Model', image: '', links: ''
  });
  const router = useRouter();

  const handleOpenForm = (event?: any) => {
    if (event) {
      setFormData({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0],
        links: event.links ? event.links.join(', ') : ''
      });
      setCurrentEvent(event);
    } else {
      setFormData({
        title: '', year: new Date().getFullYear(), date: new Date().toISOString().split('T')[0],
        description: '', impact: 'Medium', category: 'Model', image: '', links: ''
      });
      setCurrentEvent(null);
    }
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      links: formData.links.split(',').map((l: string) => l.trim()).filter((l: string) => l)
    };

    const url = currentEvent ? `/api/events/${currentEvent._id}` : '/api/events';
    const method = currentEvent ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      // Reload page to fetch new events via server component
      router.refresh();
      setIsEditing(false);
    } else {
      alert('Failed to save event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Failed to delete event');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will load all the massive AI timeline mock events straight into your empty database! Proceed?')) return;
    try {
      const res = await fetch('/api/events/seed', { method: 'POST' });
      if (res.ok) {
        alert('Database successfully seeded with the timeline history!');
        router.refresh();
      } else {
        alert('Failed to seed! Might already be seeded.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-32">
      {isUsingMock && (
        <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-md text-primary font-mono text-sm text-center">
          Warning: Your database is connected, but it is entirely empty. You are currently viewing mock fallback data.
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold font-mono text-foreground mb-2">Admin Control Panel</h1>
          <p className="text-sm font-mono text-muted-foreground">Manage AITimeline events and milestones</p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3">
          {isUsingMock && (
            <button 
              onClick={handleSeed}
              className="flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-background rounded font-mono text-sm transition-colors"
            >
              Seed Database
            </button>
          )}
          <button 
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground hover:bg-muted hover:text-primary rounded font-mono text-sm transition-colors"
          >
            <Plus size={16} /> New Event
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-accent/30 text-accent hover:bg-accent hover:text-background rounded font-mono text-sm transition-colors"
          >
            <LogOut size={16} /> Exit
          </button>
        </div>
      </div>

      <div className="bg-secondary rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background text-sm font-mono text-muted-foreground">
              <th className="p-4">Date</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Impact</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id} className="border-b border-background hover:bg-background/50 transition-colors">
                <td className="p-4 font-mono text-sm text-muted-foreground">
                  {format(new Date(event.date), 'yyyy-MM-dd')}
                </td>
                <td className="p-4 font-mono font-medium text-foreground">
                  {event.title}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs font-mono rounded bg-background text-muted-foreground">
                    {event.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-mono rounded ${
                    event.impact === 'Revolutionary' ? 'bg-background text-accent' : 'bg-background text-primary'
                  }`}>
                    {event.impact}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleOpenForm(event)} className="p-2 text-muted-foreground hover:text-foreground transition-colors inline-block">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="p-2 text-muted-foreground hover:text-accent transition-colors inline-block ml-2">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 text-foreground">
          <div className="w-full max-w-2xl bg-secondary rounded p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold font-mono mb-6">
              {currentEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-background border-none rounded text-foreground font-mono focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1">Date</label>
                  <input type="date" required value={formData.date} onChange={e => {
                      const d = e.target.value;
                      setFormData({...formData, date: d, year: parseInt(d.split('-')[0], 10)})
                  }} className="w-full px-3 py-2 bg-background border-none rounded text-foreground font-mono focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-background border-none rounded text-foreground font-mono focus:ring-1 focus:ring-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-background border-none rounded text-foreground font-mono appearance-none focus:ring-1 focus:ring-primary">
                    <option>Model</option><option>Research</option><option>Product</option><option>Company</option>
                    <option>Infrastructure</option><option>Policy</option><option>Breakthrough</option><option>Tool</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1">Impact Level</label>
                  <select value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} className="w-full px-3 py-2 bg-background border-none rounded text-foreground font-mono appearance-none focus:ring-1 focus:ring-primary">
                    <option>Low</option><option>Medium</option><option>High</option><option>Revolutionary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">Image URL (Optional)</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 bg-background border-none rounded text-foreground font-mono focus:ring-1 focus:ring-primary" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">Links (Comma separated urls)</label>
                <input type="text" value={formData.links} onChange={e => setFormData({...formData, links: e.target.value})} className="w-full px-3 py-2 bg-background border-none rounded text-foreground font-mono focus:ring-1 focus:ring-primary" />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded text-sm font-mono text-muted-foreground hover:bg-background transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded text-sm font-mono bg-background text-foreground hover:bg-primary hover:text-background transition-colors">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
