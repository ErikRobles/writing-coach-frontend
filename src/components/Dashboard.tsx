import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Activity, Flame, FileText, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/user/me/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setStats(data));

    fetch('http://localhost:8080/user/me/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setHistory(data))
      .catch(() => setHistory([]));
  }, [token]);

  if (!stats) return <div className="p-8 text-on-surface flex items-center justify-center h-full">Loading telemetry...</div>;

  return (
    <div className="p-8 md:p-12 w-full max-w-6xl mx-auto space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-space-grotesk font-extrabold tracking-tight">Dossier: <span className="text-primary">{stats.email}</span></h1>
        <p className="text-on-surface-variant max-w-lg">
          Your personal writing telemetry. Track frequency, depth, and AI interventions across all active nodes.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 backdrop-blur-md flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Flame className="w-6 h-6" />
            <h3 className="font-space-grotesk font-bold uppercase tracking-wider text-sm">Active Streak</h3>
          </div>
          <p className="text-5xl font-newsreader">{stats.stats?.daily_streak ?? 0}</p>
          <span className="text-xs text-on-surface-variant">Consecutive days</span>
        </div>
        
        <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 backdrop-blur-md flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-primary">
            <Activity className="w-6 h-6" />
            <h3 className="font-space-grotesk font-bold uppercase tracking-wider text-sm">Analyses Run</h3>
          </div>
          <p className="text-5xl font-newsreader">{stats.stats?.total_analyzed ?? 0}</p>
          <span className="text-xs text-on-surface-variant">Total AI interventions</span>
        </div>

        <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 backdrop-blur-md flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-indigo-400">
            <Calendar className="w-6 h-6" />
            <h3 className="font-space-grotesk font-bold uppercase tracking-wider text-sm">Member Since</h3>
          </div>
          <p className="text-2xl font-space-grotesk break-all pt-2 text-on-surface/80">
            {new Date(stats.created_at).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-space-grotesk font-bold flex items-center"><FileText className="w-5 h-5 mr-3 text-primary" /> Recent Diagnostics</h2>
        <div className="grid grid-cols-1 gap-4">
          {history.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant border border-on-surface/5 rounded-2xl border-dashed">No recent diagnostics found. Initialize a chat to begin tracking.</div>
          ) : (
            history.map((doc, i) => (
              <div key={i} className="bg-surface/10 border border-on-surface/5 rounded-2xl p-5 space-y-3">
                <span className="text-xs text-primary/70 font-inter">{new Date(doc.timestamp).toLocaleString()}</span>
                <p className="font-newsreader line-clamp-2 text-on-surface/80">"{doc.user_draft}"</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
