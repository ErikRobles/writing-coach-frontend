import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ChatView from './components/ChatView';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminArea from './components/AdminArea';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './AuthContext';
import { PenTool } from 'lucide-react';

function ProtectedRoute({ children, reqRole }: { children: React.ReactNode, reqRole?: string }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (reqRole && role !== reqRole) return <Navigate to="/chat" replace />;
  return <>{children}</>;
}

function MainLayout() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex h-screen w-full overflow-hidden aztec-pattern bg-background text-on-background font-inter">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 relative flex flex-col h-full overflow-hidden">
        {/* Mobile Header - Removed fixed and top-0 to keep it in flex flow */}
        <header className="md:hidden w-full z-50 bg-[#0e0e10]/80 backdrop-blur-xl border-b border-[#a9ffdf]/10 shadow-[0px_24px_48px_rgba(0,0,0,0.5)] pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between px-6 h-16 w-full">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center -rotate-3 border border-primary/20 shadow-lg">
                <PenTool className="text-primary w-5 h-5" />
              </div>
              <h1 className="font-space font-black tracking-tighter text-xl text-[#00FFC8]">WritingCoach</h1>
            </div>
          </div>
        </header>

        {/* Content View - Removed redundant mt and pt as header is now in-flow */}
        <div className="flex-1 w-full h-full overflow-y-auto pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0 hide-scrollbar">
          <Routes>
            <Route path="/chat" element={<ChatView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={
              <ProtectedRoute reqRole="admin">
                <AdminArea />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </div>
        
        <BottomNav />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
