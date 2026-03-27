import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { ShieldAlert, Users, TrendingUp } from 'lucide-react';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://127.0.0.1:8080";

export default function AdminArea() {
  const { token, role } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
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

  if (error) return <div className="p-8 text-red-400 flex items-center justify-center font-space-grotesk tracking-widest">{error}</div>;

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-space-grotesk font-extrabold tracking-tight flex items-center">
          <ShieldAlert className="w-10 h-10 mr-4 text-emerald-400" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">
            Admin Dashboard
          </span>
        </h1>
        <p className="text-on-surface-variant">Manage Users and View Progress</p>
      </header>

      <section className="bg-surface/20 border border-on-surface/5 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-on-surface/10 font-space-grotesk">
                <th className="p-4 text-xs tracking-wider uppercase text-on-surface-variant font-bold">Email / ID</th>
                <th className="p-4 text-xs tracking-wider uppercase text-on-surface-variant font-bold">Role</th>
                <th className="p-4 text-xs tracking-wider uppercase text-on-surface-variant font-bold">Suggestions</th>
                <th className="p-4 text-xs tracking-wider uppercase text-on-surface-variant font-bold">Streak</th>
                <th className="p-4 text-xs tracking-wider uppercase text-on-surface-variant font-bold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-on-surface/5">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-surface/30 transition-colors">
                  <td className="p-4">
                    <div className="font-space-grotesk font-bold text-on-surface">{u.email || u.username || 'Unknown User'}</div>
                    <div className="font-inter text-xs text-on-surface-variant/50 max-w-[120px] truncate">{u.user_id}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${(u.role || 'user') === 'admin' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                      {(u.role || 'user').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-newsreader text-xl text-on-surface/80">{u.stats?.total_analyzed ?? 0}</td>
                  <td className="p-4 font-newsreader text-xl text-on-surface/80">{u.stats?.daily_streak ?? 0}</td>
                  <td className="p-4 font-inter text-sm text-on-surface-variant">{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="p-8 text-center text-on-surface-variant">Loading users...</div>}
        </div>
      </section>
    </div>
  );
}
