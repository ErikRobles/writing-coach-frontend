import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { PenTool } from 'lucide-react';

const Sidebar = lazy(() => import('./components/Sidebar'));
const BottomNav = lazy(() => import('./components/BottomNav'));
const ChatView = lazy(() => import('./components/ChatView'));
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AdminArea = lazy(() => import('./components/AdminArea'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const PaymentSuccess = lazy(() => import('./components/PaymentSuccess'));

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
      <Suspense fallback={<div className="w-64 bg-background"></div>}>
        <Sidebar />
      </Suspense>
      
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
          <Suspense fallback={<div className="flex-1 flex items-center justify-center h-full">Loading...</div>}>
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
          </Suspense>
        </div>
        
        <Suspense fallback={<div className="h-16 bg-background"></div>}>
          <BottomNav />
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="*" element={<MainLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
