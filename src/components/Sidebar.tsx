import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role, email } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0e0e10]/80 backdrop-blur-xl border-r border-[#a9ffdf]/10 p-6 z-40">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="font-space font-black tracking-tighter text-2xl text-[#00FFC8]">WritingCoach</h1>
      </div>

      <nav className="flex flex-col gap-6 flex-1 overflow-y-auto hide-scrollbar pb-6">
        {/* User Info Section */}
        <div className="mb-6 p-4 rounded-xl bg-surface-container/50 border border-outline-variant/20 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'admin' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary/20 text-secondary border border-secondary/30'}`}>
              <span className="material-symbols-outlined text-sm">{role === 'admin' ? 'shield' : 'person'}</span>
            </div>
            <div className="flex flex-col overflow-hidden w-full">
              <span className="font-space text-[10px] font-bold uppercase tracking-widest text-on-surface-variant leading-none mb-1">Signed in as</span>
              <span className="font-inter text-[10px] font-semibold text-on-surface break-all" title={email || ''}>
                {email || 'Guest User'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-[8px] font-space font-bold uppercase tracking-tighter border ${role === 'admin' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface-bright text-on-surface-variant border-outline-variant/30'}`}>
              {role === 'admin' ? 'ADMIN ACCESS' : 'USER'}
            </span>
          </div>
        </div>

        <div onClick={() => navigate('/chat')} className={`flex items-center gap-4 cursor-pointer transition-all group ${location.pathname === '/chat' ? 'text-[#00FFC8] bg-[#19191c] p-3 rounded-lg border border-primary/20' : 'text-on-surface-variant hover:text-[#00FFC8]'}`}>
          <span className={`material-symbols-outlined ${location.pathname !== '/chat' ? 'group-hover:scale-110 transition-transform' : ''}`}>auto_awesome</span>
          <span className="font-inter text-xs uppercase tracking-widest font-bold">Coach</span>
        </div>

        <div onClick={() => navigate('/dashboard')} className={`flex items-center gap-4 cursor-pointer transition-all group ${location.pathname === '/dashboard' ? 'text-[#00FFC8] bg-[#19191c] p-3 rounded-lg border border-primary/20' : 'text-on-surface-variant hover:text-[#00FFC8]'}`}>
          <span className={`material-symbols-outlined ${location.pathname !== '/dashboard' ? 'group-hover:scale-110 transition-transform' : ''}`}>insights</span>
          <span className="font-inter text-xs uppercase tracking-widest font-bold">Stats</span>
        </div>

        {role === 'admin' && (
          <div onClick={() => navigate('/admin')} className={`flex items-center gap-4 cursor-pointer transition-all group ${location.pathname === '/admin' ? 'text-[#00FFC8] bg-[#19191c] p-3 rounded-lg border border-primary/20' : 'text-on-surface-variant hover:text-[#00FFC8]'}`}>
            <span className={`material-symbols-outlined ${location.pathname !== '/admin' ? 'group-hover:scale-110 transition-transform' : ''}`}>shield</span>
            <span className="font-inter text-xs uppercase tracking-widest font-bold">Admin</span>
          </div>
        )}

        <div onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-4 text-red-500/70 hover:text-red-500 cursor-pointer transition-all group mt-auto pt-4">
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">logout</span>
          <span className="font-inter text-xs uppercase tracking-widest font-bold">Logout</span>
        </div>
      </nav>
    </aside>
  );
}
