import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role } = useAuth();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-[#131316]/80 backdrop-blur-2xl border-t border-[#a9ffdf]/5 rounded-t-lg shadow-2xl">
      <div onClick={() => navigate('/chat')} className={`flex flex-col cursor-pointer items-center justify-center transition-all ${location.pathname === '/chat' ? 'text-[#00FFC8] bg-[#19191c] rounded-md px-4 py-1' : 'text-on-surface-variant hover:text-[#00FFC8]'}`}>
        <span className="material-symbols-outlined">auto_awesome</span>
        <span className="font-inter text-[10px] uppercase tracking-widest mt-1">Coach</span>
      </div>
      <div onClick={() => navigate('/dashboard')} className={`flex flex-col cursor-pointer items-center justify-center transition-all ${location.pathname === '/dashboard' ? 'text-[#00FFC8] bg-[#19191c] rounded-md px-4 py-1' : 'text-on-surface-variant hover:text-[#00FFC8]'}`}>
        <span className="material-symbols-outlined">insights</span>
        <span className="font-inter text-[10px] uppercase tracking-widest mt-1">Stats</span>
      </div>
      
      {role === 'admin' && (
        <div onClick={() => navigate('/admin')} className={`flex flex-col cursor-pointer items-center justify-center transition-all ${location.pathname === '/admin' ? 'text-[#00FFC8] bg-[#19191c] rounded-md px-4 py-1' : 'text-on-surface-variant hover:text-[#00FFC8]'}`}>
          <span className="material-symbols-outlined">shield</span>
          <span className="font-inter text-[10px] uppercase tracking-widest mt-1">Admin</span>
        </div>
      )}

      <div onClick={() => { logout(); navigate("/login"); }} className={`flex flex-col cursor-pointer items-center justify-center transition-all text-red-500/70 hover:text-red-500`}>
        <span className="material-symbols-outlined">logout</span>
        <span className="font-inter text-[10px] uppercase tracking-widest mt-1">Exit</span>
      </div>
    </nav>
  );
}
