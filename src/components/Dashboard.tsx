import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Activity, Flame, FileText, Calendar, TrendingUp } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { getPracticeHistory } from '../api';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://127.0.0.1:8080";

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<any[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{message: string, isError: boolean} | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/user/me/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => setStats(null));

    fetch(`${API_BASE_URL}/user/me/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]));

    getPracticeHistory()
      .then(data => setPracticeHistory(Array.isArray(data) ? data : []))
      .catch(() => setPracticeHistory([]));
  }, [token]);

  const handleSendTestEmail = async () => {
    setIsSendingEmail(true);
    setEmailStatus(null);
    try {
      const response = await fetch(`${API_BASE_URL}/user/me/test-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setEmailStatus({ message: data.message, isError: false });
      } else {
        setEmailStatus({ message: data.error || data.detail || 'Failed to send email', isError: true });
      }
    } catch (err) {
      setEmailStatus({ message: 'Network error', isError: true });
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailStatus(null), 5000);
    }
  };

  const chartData = (Array.isArray(practiceHistory) ? practiceHistory : []).map(h => ({
    date: h.timestamp ? new Date(h.timestamp).toLocaleDateString() : 'N/A',
    spelling: h.scores?.spelling ?? 0,
    grammar: h.scores?.grammar ?? 0,
    style: h.scores?.style ?? 0
  }));

  if (!stats) return <div className="p-8 text-on-surface flex items-center justify-center h-full">Loading your stats...</div>;

  return (
    <div className="p-8 md:p-12 w-full max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-space font-extrabold tracking-tight">Dashboard for <span className="text-primary">{stats.email}</span></h1>
          <p className="text-on-surface-variant max-w-lg">
            Check your writing progress. See how often you write and how many suggestions you've received.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          {emailStatus && (
            <div className={`px-4 py-2 rounded-lg text-xs font-space font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2 ${emailStatus.isError ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
              {emailStatus.message}
            </div>
          )}
          <button 
            onClick={handleSendTestEmail}
            disabled={isSendingEmail}
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl font-space text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all active:scale-95 disabled:opacity-50">
            <span className={`material-symbols-outlined text-sm ${isSendingEmail ? 'animate-spin' : ''}`}>
              {isSendingEmail ? 'sync' : 'mail'}
            </span>
            {isSendingEmail ? 'Sending...' : 'Send Test Report'}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 backdrop-blur-md flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Flame className="w-6 h-6" />
            <h3 className="font-space font-bold uppercase tracking-wider text-sm">Writing Streak</h3>
          </div>
          <p className="text-5xl font-newsreader">{stats.stats?.daily_streak ?? 0}</p>
          <span className="text-xs text-on-surface-variant">Consecutive days</span>
        </div>

        <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 backdrop-blur-md flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-primary">
            <Activity className="w-6 h-6" />
            <h3 className="font-space font-bold uppercase tracking-wider text-sm">Suggestions Used</h3>
          </div>
          <p className="text-5xl font-newsreader">{stats.stats?.total_analyzed ?? 0}</p>
          <span className="text-xs text-on-surface-variant">Number of times you asked for help</span>
        </div>

        <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 backdrop-blur-md flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-tertiary">
            <TrendingUp className="w-6 h-6" />
            <h3 className="font-space font-bold uppercase tracking-wider text-sm">Practice Sessions</h3>
          </div>
          <p className="text-5xl font-newsreader">{stats.stats?.total_practice_sessions ?? 0}</p>
          <span className="text-xs text-on-surface-variant">Completed practice sessions</span>
        </div>

        <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 backdrop-blur-md flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-indigo-400">
            <Calendar className="w-6 h-6" />
            <h3 className="font-space font-bold uppercase tracking-wider text-sm">Member Since</h3>
          </div>
          <p className="text-2xl font-space break-all pt-2 text-on-surface/80">
            {stats.created_at ? new Date(stats.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </section>

      {Array.isArray(practiceHistory) && practiceHistory.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-space font-bold flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-tertiary" /> 
            Linear Improvement Progression
          </h2>
          <div className="bg-surface/20 border border-on-surface/5 rounded-3xl p-8 backdrop-blur-md h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E1E1E', 
                    border: '1px solid #333', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'Space Grotesk'
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="spelling" 
                  stroke="#00F5FF" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  name="Spelling"
                />
                <Line 
                  type="monotone" 
                  dataKey="grammar" 
                  stroke="#A9FFDF" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  name="Grammar"
                />
                <Line 
                  type="monotone" 
                  dataKey="style" 
                  stroke="#FF69B4" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  name="Style"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-xl font-space font-bold flex items-center"><FileText className="w-5 h-5 mr-3 text-primary" /> Recent Writing History</h2>
        <div className="grid grid-cols-1 gap-4">
          {!Array.isArray(history) || history.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant border border-on-surface/5 rounded-2xl border-dashed">No recent history found. Start writing to see your history here.</div>
          ) : (
            history.map((doc, i) => (
              <div key={i} className="bg-surface/10 border border-on-surface/5 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-primary/70 font-inter">{doc.timestamp ? new Date(doc.timestamp).toLocaleString() : 'N/A'}</span>
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-space font-bold uppercase tracking-tighter border ${doc.type === 'practice' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                    {doc.type ?? 'analysis'}
                  </span>
                </div>
                <p className="font-newsreader line-clamp-2 text-on-surface/80">"{doc.text_preview}"</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
