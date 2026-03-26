import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0e0e10]/80 backdrop-blur-xl border-r border-[#a9ffdf]/10 p-6 z-40">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="font-space font-black tracking-tighter text-2xl text-[#00FFC8]">WritingTutor</h1>
      </div>

      <nav className="flex flex-col gap-6 flex-1 overflow-y-auto hide-scrollbar pb-6">

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
