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
        {/* Mobile Header */}
        <header className="md:hidden fixed top-0 w-full z-50 bg-[#0e0e10]/60 backdrop-blur-xl border-b border-[#a9ffdf]/10 shadow-[0px_24px_48px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between px-6 h-16 w-full">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#00FFC8]">menu</span>
              <h1 className="font-space font-black tracking-tighter text-xl text-[#00FFC8]">WritingCoach.AI</h1>
            </div>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 w-full h-full overflow-y-auto mt-16 md:mt-0 pb-[72px] md:pb-0 hide-scrollbar">
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
