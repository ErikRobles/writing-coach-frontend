import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { ShieldAlert, Users, TrendingUp, X, FileText, Activity, Flame, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../api';

export default function AdminArea() {
  const { token, role } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingLoadingDetails] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role !== 'admin') {
      setError("You don't have permission to view this page.");
      return;
    }
    fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to load users');
        return r.json();
      })
      .then(data => setUsers(data))
      .catch(err => setError(err.message));
  }, [token, role]);

  const fetchUserDetails = async (user: any) => {
    setSelectedUser(user);
    setIsLoadingLoadingDetails(true);
    setUserDetails(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/user/${user.user_id}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to load details');
      const data = await response.json();
      setUserDetails(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingLoadingDetails(false);
    }
  };

  if (error) return <div className="p-8 text-red-400 flex items-center justify-center font-space tracking-widest uppercase text-xs">{error}</div>;

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-space font-extrabold tracking-tight flex items-center">
          <ShieldAlert className="w-10 h-10 mr-4 text-emerald-400" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500 uppercase">
            Admin Control Center
          </span>
        </h1>
        <p className="text-on-surface-variant font-space text-sm tracking-widest uppercase">Student Analytics & User Management</p>
      </header>

      <section className="bg-surface/20 border border-on-surface/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-on-surface/10 font-space">
                <th className="p-6 text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-black">Student Profile</th>
                <th className="p-6 text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-black">Access Level</th>
                <th className="p-6 text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-black text-center">Suggestions</th>
                <th className="p-6 text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-black text-center">Streak</th>
                <th className="p-6 text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-black">Registration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-on-surface/5">
              {users.map((u, i) => (
                <tr 
                  key={i} 
                  onClick={() => fetchUserDetails(u)}
                  className="hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <td className="p-6">
                    <div className="font-space font-bold text-on-surface text-lg group-hover:text-primary transition-colors">{u.email || 'Unknown User'}</div>
                    <div className="font-inter text-[10px] text-on-surface-variant/40 tracking-tight">{u.user_id}</div>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-[4px] text-[10px] font-space font-black tracking-tighter border ${(u.role || 'user') === 'admin' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                      {(u.role || 'user').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <span className="font-newsreader text-2xl text-on-surface/80">{u.stats?.total_analyzed ?? 0}</span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Flame className={`w-4 h-4 ${u.stats?.daily_streak > 0 ? 'text-orange-400' : 'text-on-surface-variant/20'}`} />
                      <span className="font-newsreader text-2xl text-on-surface/80">{u.stats?.daily_streak ?? 0}</span>
                    </div>
                  </td>
                  <td className="p-6 font-inter text-xs text-on-surface-variant/60">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <Activity className="w-12 h-12 text-on-surface-variant/20 animate-pulse" />
              <p className="font-space text-xs tracking-widest uppercase text-on-surface-variant">Scanning for data units...</p>
            </div>
          )}
        </div>
      </section>

      {/* Student Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-surface-container border border-on-surface/10 rounded-[40px] w-full max-w-5xl max-h-[90dvh] overflow-hidden flex flex-col shadow-[0px_0px_100px_rgba(0,255,200,0.1)]">
            <header className="p-8 border-b border-on-surface/5 flex items-center justify-between bg-surface/30">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Users className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-space font-black text-2xl text-on-surface uppercase tracking-tight">{selectedUser.email}</h2>
                  <p className="font-space text-[10px] tracking-[0.2em] text-on-surface-variant uppercase">Student Insight Report</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors group"
              >
                <X className="w-6 h-6 text-on-surface-variant group-hover:text-red-400 transition-colors" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-12 hide-scrollbar">
              {isLoadingDetails ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-space text-[10px] tracking-widest uppercase text-on-surface-variant">Fetching Student History...</p>
                </div>
              ) : userDetails && (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-primary">
                        <Activity className="w-4 h-4" />
                        <span className="font-space text-[10px] font-black uppercase tracking-widest">Suggestions Used</span>
                      </div>
                      <p className="text-5xl font-newsreader">{userDetails.user.stats?.total_analyzed ?? 0}</p>
                    </div>
                    <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-orange-400">
                        <Flame className="w-4 h-4" />
                        <span className="font-space text-[10px] font-black uppercase tracking-widest">Active Streak</span>
                      </div>
                      <p className="text-5xl font-newsreader">{userDetails.user.stats?.daily_streak ?? 0}</p>
                    </div>
                    <div className="bg-surface/30 border border-on-surface/5 rounded-3xl p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-space text-[10px] font-black uppercase tracking-widest">Enrolled Date</span>
                      </div>
                      <p className="text-2xl font-space pt-2">{new Date(userDetails.user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* History Section */}
                  <section className="space-y-6">
                    <h3 className="text-xl font-space font-bold flex items-center gap-3 text-on-surface">
                      <FileText className="w-5 h-5 text-primary" /> 
                      Recent Submission History
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {userDetails.history.length === 0 ? (
                        <div className="p-12 text-center text-on-surface-variant border border-on-surface/5 rounded-[32px] border-dashed font-space text-xs tracking-widest uppercase">No submissions recorded for this student.</div>
                      ) : (
                        userDetails.history.map((doc: any, i: number) => (
                          <div key={i} className="bg-surface/10 border border-on-surface/5 rounded-[24px] p-6 space-y-4 hover:border-primary/20 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-primary/70 font-space font-bold uppercase tracking-widest">
                                {new Date(doc.timestamp).toLocaleString()}
                              </span>
                              <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-space font-bold uppercase tracking-tighter border ${doc.type === 'practice' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                {doc.type ?? 'analysis'}
                              </span>
                            </div>
                            <p className="font-newsreader text-xl leading-relaxed text-on-surface/80 line-clamp-3 italic">"{doc.text_preview}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
