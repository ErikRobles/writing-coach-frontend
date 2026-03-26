import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { PenTool, CheckCircle2, Zap, CreditCard, MonitorPlay } from 'lucide-react';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:8080";

export default function LandingPage() {
  const [selectedTier, setSelectedTier] = useState<null | 'free' | 'premium'>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { login, token } = useAuth();
  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup' && selectedTier === 'premium' && !paymentSuccess) {
      setError('Please complete the mock payment to subscribe to Premium.');
      return;
    }

    setError('');

    const url = authMode === 'login' ? `${API_BASE_URL}/login` : `${API_BASE_URL}/signup`;
    try {
      let body;
      let headers = {};

      if (authMode === 'login') {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        body = formData;
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      } else {
        body = JSON.stringify({ email, password });
        headers = { 'Content-Type': 'application/json' };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      const currentEmail = email.toLowerCase();
      const role = currentEmail === 'erikjames69@hotmail.com' ? 'admin' : 'user';
      login(data.access_token, role);
      navigate('/chat');

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMockPayment = (method: string) => {
    setPaymentSuccess(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-inter selection:bg-primary/30 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

        {/* Left Side: Hero & Value Prop */}
        <div className="flex flex-col justify-center space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform">
              <PenTool className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-2xl font-space font-black tracking-tighter text-primary">WritingTutor</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-space font-bold leading-tight tracking-tighter">
              Write better, <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">instantly.</span>
            </h2>
            <p className="text-lg md:text-xl font-newsreader text-on-surface-variant leading-relaxed max-w-lg">
              Meet your friendly, intelligent writing tutor. WritingTutor helps you catch mistakes,
              improve your style, and write with confidence every single time.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
              <p className="text-on-surface/90">Get instant, real-time grammar and style suggestions.</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
              <p className="text-on-surface/90">Track your writing streak and progress safely.</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
              <p className="text-on-surface/90">Friendly interface designed to help you focus.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth / Pricing Flow */}
        <div className="flex flex-col justify-center w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-surface-container-low/60 backdrop-blur-2xl p-8 rounded-3xl border border-on-surface/5 shadow-[0_24px_48px_rgba(0,0,0,0.5)]">

            <div className="flex w-full mb-8 bg-surface-container rounded-xl p-1">
              {token ? (
                <div className="flex-1 py-2 text-center text-primary font-space font-bold rounded-lg text-sm bg-background shadow-md">
                  Active Session Found
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setAuthMode('signup'); setSelectedTier(null); setError(''); }}
                    className={`flex-1 py-2 font-space font-bold rounded-lg text-sm transition-colors ${authMode === 'signup' ? 'bg-background shadow-md text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => { setAuthMode('login'); setError(''); }}
                    className={`flex-1 py-2 font-space font-bold rounded-lg text-sm transition-colors ${authMode === 'login' ? 'bg-background shadow-md text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    Log In
                  </button>
                </>
              )}
            </div>

            {authMode === 'signup' && !selectedTier && !token ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="font-space font-semibold text-lg mb-4">Choose your plan</h3>

                {/* Free Tier */}
                <button
                  onClick={() => setSelectedTier('free')}
                  className="w-full text-left p-5 rounded-2xl bg-surface border border-outline-variant/30 hover:border-primary/50 transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-space font-bold text-lg text-on-surface group-hover:text-primary transition-colors">Free Plan</h4>
                    <span className="text-sm font-bold bg-surface-bright px-3 py-1 rounded-full">$0</span>
                  </div>
                  <ul className="space-y-2 text-sm text-on-surface-variant font-inter">
                    <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Small token usage per day</li>
                    <li className="flex items-center gap-2"><MonitorPlay className="w-4 h-4 text-on-surface-variant" /> Ad-supported experience</li>
                  </ul>
                </button>

                {/* Premium Tier */}
                <button
                  onClick={() => setSelectedTier('premium')}
                  className="w-full text-left p-5 rounded-2xl bg-surface border border-outline-variant/30 hover:border-emerald-400/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-emerald-400"></div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-space font-bold text-lg text-on-surface group-hover:text-emerald-400 transition-colors">Premium Plan</h4>
                    <span className="text-sm font-bold bg-primary text-background px-3 py-1 rounded-full">$9.99/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm text-on-surface-variant font-inter">
                    <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-400" /> Massive token amounts</li>
                    <li className="flex items-center gap-2"><MonitorPlay className="w-4 h-4 text-emerald-400" /> Ad-free experience</li>
                  </ul>
                </button>
              </div>
            ) : token ? (
              <div className="flex flex-col items-center justify-center py-6 animate-in fade-in space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <h3 className="font-space font-semibold text-xl text-center">You're already logged in!</h3>
                <button
                  onClick={() => navigate('/chat')}
                  className="w-full mt-4 bg-primary text-background font-space font-bold py-3.5 rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(0,253,198,0.2)]"
                >
                  Open WritingTutor
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-space font-semibold text-xl">
                    {authMode === 'login' ? 'Welcome back' : 'Create your account'}
                  </h3>
                  {authMode === 'signup' && (
                    <button
                      type="button"
                      onClick={() => setSelectedTier(null)}
                      className="text-xs font-bold text-primary hover:text-emerald-300 underline underline-offset-2"
                    >
                      Change plan
                    </button>
                  )}
                </div>

                {authMode === 'signup' && selectedTier === 'premium' && (
                  <div className="mb-6 p-4 rounded-xl bg-surface border border-primary/20 space-y-3">
                    <p className="text-sm text-on-surface-variant">Complete mock payment to continue:</p>
                    {paymentSuccess ? (
                      <div className="bg-emerald-400/10 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5" /> Payment Successful!
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => handleMockPayment('paypal')}
                          className="flex-1 bg-[#003087] hover:bg-[#002266] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold"
                        >
                          <CreditCard className="w-4 h-4" /> PayPal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMockPayment('mercadopago')}
                          className="flex-1 bg-[#00b1ea] hover:bg-[#0099cc] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold"
                        >
                          <CreditCard className="w-4 h-4" /> Mercado Pago
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {error && <div className="text-red-400 text-sm font-inter bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</div>}

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-inter font-medium text-on-surface-variant uppercase tracking-wider ml-1">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-background border border-on-surface/10 rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-inter font-medium text-on-surface-variant uppercase tracking-wider ml-1">Password</label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-background border border-on-surface/10 rounded-xl px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-primary text-background font-space font-bold py-3.5 rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(0,253,198,0.2)]"
                >
                  {authMode === 'login' ? 'Log In' : `Sign Up - ${selectedTier === 'premium' ? 'Premium' : 'Free'}`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
