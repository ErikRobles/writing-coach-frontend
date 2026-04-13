import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Activity, Flame, FileText, Calendar, TrendingUp, Zap, AlertCircle } from 'lucide-react';
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
import { getPracticeHistory, getUserStats, API_BASE_URL } from '../api';

const TIER_LIMITS: Record<string, number> = {
  "free": 50,
  "basic": 300,
  "pro": 1000,
  "premium": 5000,
  "corporate": 999999
};

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<any[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{message: string, isError: boolean} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch main stats
        const statsData = await getUserStats();
        if (statsData.error) {
          setError(statsData.error);
        } else {
          setStats(statsData);
        }

        // Fetch general history
        const historyRes = await fetch(`${API_BASE_URL}/user/me/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(Array.isArray(historyData) ? historyData : []);
        }

        // Fetch practice history for chart
        try {
          const practiceData = await getPracticeHistory();
          setPracticeHistory(Array.isArray(practiceData) ? practiceData : []);
        } catch (e) {
          console.error("Practice history failed to load", e);
        }

      } catch (err: any) {
        console.error("Dashboard data fetch error:", err);
        setError(err.message || "Failed to connect to the server. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-space text-xs font-black uppercase tracking-widest text-on-surface-variant">Syncing Data Units...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <AlertCircle className="text-red-500 w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-space font-black text-2xl uppercase text-on-surface">Data Link Error</h2>
          <p className="font-newsreader text-lg text-on-surface-variant max-w-md italic">{error || "Could not retrieve your statistics."}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-surface-container-high text-on-surface font-space font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-primary hover:text-on-primary-fixed transition-all shadow-xl"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const currentTier = stats.stats?.current_tier || 'free';
  const tokensUsed = stats.stats?.monthly_tokens_used || 0;
  const tokenLimit = TIER_LIMITS[currentTier] || 50;
  const usagePercent = Math.min((tokensUsed / tokenLimit) * 100, 100);

  return (
    <div className="p-8 md:p-12 w-full max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 w-full">
          <h1 className="text-2xl md:text-4xl font-space font-extrabold tracking-tight break-words flex flex-col gap-1">
            <span>Dashboard for</span>
            <span className="text-primary break-all">{stats.email}</span>
          </h1>
          <p className="text-on-surface-variant max-w-lg text-sm md:text-base">
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

      {/* Subscription & Usage Card */}
      <section className="bg-surface-container p-8 rounded-[32px] border border-outline-variant/10 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Zap className="w-32 h-32 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary text-on-primary-fixed rounded-lg font-space font-black text-[10px] uppercase tracking-widest">
                {currentTier} Plan
              </span>
              <span className="font-space text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Monthly Usage</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-newsreader text-on-surface">{tokensUsed}</span>
                <span className="text-xl font-space text-on-surface-variant mb-1">/ {tokenLimit === 999999 ? 'Unlimited' : tokenLimit} tokens</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${usagePercent > 90 ? 'bg-red-500' : 'bg-primary'}`} 
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-surface-container-highest text-on-surface font-space font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-primary hover:text-background transition-all border border-outline-variant/20 shadow-lg"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </section>

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
            <h3 className="font-space font-bold uppercase tracking-wider text-sm">Help Received</h3>
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
            Your Progress Chart
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
