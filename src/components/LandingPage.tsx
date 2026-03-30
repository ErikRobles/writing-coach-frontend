import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  PenTool, 
  CheckCircle2, 
  Zap, 
  CreditCard, 
  MonitorPlay, 
  TrendingUp, 
  Mail, 
  Target, 
  ShieldCheck,
  Smartphone,
  Apple
} from 'lucide-react';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://127.0.0.1:8080";

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
      login(data.access_token, role, currentEmail);
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
    <div className="min-h-screen bg-background text-on-surface font-inter selection:bg-primary/30 relative overflow-x-hidden">

      {/* Background Pattern Layers */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M30 0l30 30-30 30L0 30z\" fill=\"none\" stroke=\"%2348474a\" stroke-width=\"0.5\"/%3E%3Cpath d=\"M15 15l30 0 0 30-30 0z\" fill=\"none\" stroke=\"%2348474a\" stroke-width=\"0.5\"/%3E%3C/svg%3E')]"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-tertiary/5 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 min-h-[80vh] items-center">
          <div className="flex flex-col space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform border border-primary/20 shadow-xl shadow-primary/5">
                <PenTool className="text-primary w-7 h-7" />
              </div>
              <h1 className="text-3xl font-space font-black tracking-tighter text-on-background uppercase">WritingCoach</h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-6xl md:text-8xl font-space font-black leading-[0.9] tracking-tighter uppercase">
                Write with <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-container to-tertiary">Absolute</span> Authority.
              </h2>
              <p className="text-xl md:text-2xl font-newsreader text-on-surface-variant leading-relaxed max-w-lg italic">
                The digital atelier for modern intellects. Refine your register, master your voice, and track your evolution.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => { setAuthMode('signup'); setSelectedTier(null); }}
                className="px-8 py-4 bg-primary text-on-primary-fixed font-space font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-primary/20"
              >
                Join the Atelier
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('benefits');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-surface-container-high text-on-surface-variant font-space font-bold uppercase tracking-widest text-xs rounded-xl hover:text-on-surface border border-outline-variant/20 transition-all active:scale-95"
              >
                Explore Benefits
              </button>
            </div>
          </div>

          {/* Login / Signup Flow */}
          <div className="flex flex-col justify-center w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-surface-container-low/40 backdrop-blur-3xl p-10 rounded-[40px] border border-on-surface/5 shadow-[0_48px_96px_rgba(0,0,0,0.6)]">
              <div className="flex w-full mb-8 bg-surface-container-lowest/50 rounded-2xl p-1.5 border border-outline-variant/10">
                {token ? (
                  <div className="flex-1 py-3 text-center text-primary font-space font-black uppercase tracking-widest text-xs">
                    Authenticated Session Active
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => { setAuthMode('signup'); setSelectedTier(null); setError(''); }}
                      className={`flex-1 py-3 font-space font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${authMode === 'signup' ? 'bg-primary text-on-primary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Initialize
                    </button>
                    <button
                      onClick={() => { setAuthMode('login'); setError(''); }}
                      className={`flex-1 py-3 font-space font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${authMode === 'login' ? 'bg-primary text-on-primary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Login
                    </button>
                  </>
                )}
              </div>

              {/* Form Logic... (Keeping existing logic but updating styles) */}
              {authMode === 'signup' && !selectedTier && !token ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="font-space font-black uppercase tracking-widest text-xs text-on-surface-variant mb-4">Select Tier</h3>
                  <button onClick={() => setSelectedTier('free')} className="w-full text-left p-6 rounded-3xl bg-surface-container border border-outline-variant/10 hover:border-primary/40 transition-all group">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-space font-black text-lg text-on-surface group-hover:text-primary transition-colors uppercase tracking-tight">Free access</h4>
                      <span className="text-xs font-black bg-surface-bright px-3 py-1 rounded-full border border-outline-variant/20">$0</span>
                    </div>
                    <ul className="space-y-3 text-sm text-on-surface-variant font-inter opacity-70">
                      <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-primary" /> Daily token allocation</li>
                      <li className="flex items-center gap-3"><MonitorPlay className="w-4 h-4 text-on-surface-variant" /> Ad-supported logic</li>
                    </ul>
                  </button>
                  <button onClick={() => setSelectedTier('premium')} className="w-full text-left p-6 rounded-3xl bg-surface-container border border-primary/20 hover:border-emerald-400 transition-all group relative overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-emerald-400"></div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-space font-black text-lg text-on-surface group-hover:text-emerald-400 transition-colors uppercase tracking-tight">Premium Grade</h4>
                      <span className="text-xs font-black bg-primary text-background px-3 py-1 rounded-full">$9.99</span>
                    </div>
                    <ul className="space-y-3 text-sm text-on-surface-variant font-inter">
                      <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-emerald-400" /> Infinite token stream</li>
                      <li className="flex items-center gap-3"><MonitorPlay className="w-4 h-4 text-emerald-400" /> Pure environment</li>
                    </ul>
                  </button>
                </div>
              ) : token ? (
                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="font-space font-black uppercase tracking-widest text-sm text-center">Session Verified</h3>
                  <button onClick={() => navigate('/chat')} className="w-full bg-primary text-on-primary-fixed font-space font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-primary/20">
                    Enter Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-space font-black uppercase tracking-widest text-xs text-on-surface-variant">
                      {authMode === 'login' ? 'Authentication' : 'Registration'}
                    </h3>
                    {authMode === 'signup' && (
                      <button type="button" onClick={() => setSelectedTier(null)} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                        Change plan
                      </button>
                    )}
                  </div>

                  {authMode === 'signup' && selectedTier === 'premium' && (
                    <div className="p-6 rounded-3xl bg-surface border border-primary/20 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Secure Payment Simulation</p>
                      {paymentSuccess ? (
                        <div className="bg-emerald-400/10 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-xs font-bold border border-emerald-400/20 uppercase tracking-widest">
                          <CheckCircle2 className="w-5 h-5" /> Verified
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <button type="button" onClick={() => handleMockPayment('paypal')} className="w-full bg-[#003087] hover:bg-[#002266] text-white py-3 rounded-xl flex items-center justify-center gap-3 transition-colors font-bold text-xs">
                            <CreditCard className="w-4 h-4" /> PayPal
                          </button>
                          <button type="button" onClick={() => handleMockPayment('mercadopago')} className="w-full bg-[#00b1ea] hover:bg-[#0099cc] text-white py-3 rounded-xl flex items-center justify-center gap-3 transition-colors font-bold text-xs">
                            <CreditCard className="w-4 h-4" /> Mercado Pago
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {error && <div className="text-red-400 text-[10px] font-space font-black uppercase tracking-widest bg-red-400/5 p-4 rounded-xl border border-red-400/20">{error}</div>}

                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-space font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Identity (Email)</label>
                      <input required type="email" placeholder="USER@DOMAIN.COM" value={email} onChange={e => setEmail(e.target.value)} className="bg-surface-container border border-outline-variant/20 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/20 font-space text-sm" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-space font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Keycode (Password)</label>
                      <input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-surface-container border border-outline-variant/20 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/20 font-space text-sm" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-primary text-on-primary-fixed font-space font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-primary/20">
                    {authMode === 'login' ? 'Confirm Access' : `Finalize - ${selectedTier?.toUpperCase()}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* --- BENEFITS SECTION --- */}
        <section id="benefits" className="bg-surface-container-low py-24 md:py-48">
          <div className="max-w-7xl mx-auto px-6">
            <header className="mb-24 text-center">
              <h3 className="font-space font-black text-xs tracking-[0.4em] text-primary uppercase mb-6">Why WritingCoach?</h3>
              <h2 className="text-5xl md:text-7xl font-space font-black tracking-tighter uppercase leading-none">Elevate Your <span className="italic text-on-surface-variant/50 font-newsreader lowercase">Intellectual</span> Output.</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-6 p-8 rounded-[32px] bg-surface-container border border-outline-variant/5 hover:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="text-primary w-6 h-6" />
                </div>
                <h4 className="font-space font-bold uppercase tracking-tight text-xl">High-Precision Analysis</h4>
                <p className="font-newsreader text-on-surface-variant text-lg leading-relaxed">Instant grammar and spelling corrections grounded in standard US English. Every suggestion is scannable and actionable.</p>
              </div>

              <div className="space-y-6 p-8 rounded-[32px] bg-surface-container border border-outline-variant/5 hover:border-secondary/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <ShieldCheck className="text-secondary w-6 h-6" />
                </div>
                <h4 className="font-space font-bold uppercase tracking-tight text-xl">Register Mastery</h4>
                <p className="font-newsreader text-on-surface-variant text-lg leading-relaxed">Whether it's formal executive reports or creative street-smart prose, our AI understands and refines your intended tone.</p>
              </div>

              <div className="space-y-6 p-8 rounded-[32px] bg-surface-container border border-outline-variant/5 hover:border-tertiary/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
                  <TrendingUp className="text-tertiary w-6 h-6" />
                </div>
                <h4 className="font-space font-bold uppercase tracking-tight text-xl">Linear Progression</h4>
                <p className="font-newsreader text-on-surface-variant text-lg leading-relaxed">Visualize your improvement over time. Our analytics engine tracks your evolution through interactive performance charts.</p>
              </div>

              <div className="space-y-6 p-8 rounded-[32px] bg-surface-container border border-outline-variant/5 hover:border-indigo-400/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-400/10 flex items-center justify-center">
                  <Mail className="text-indigo-400 w-6 h-6" />
                </div>
                <h4 className="font-space font-bold uppercase tracking-tight text-xl">Weekly Intelligence</h4>
                <p className="font-newsreader text-on-surface-variant text-lg leading-relaxed">Direct-to-inbox reports every Monday. Identify common mistakes and receive tailored pro-tips to overcome your specific challenges.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- DOWNLOAD SECTION --- */}
        <section className="py-24 md:py-48 bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h3 className="font-space font-black text-xs tracking-[0.4em] text-secondary uppercase mb-8">Access Anywhere</h3>
            <h2 className="text-5xl md:text-7xl font-space font-black tracking-tighter uppercase leading-none mb-12">Download the <br/>app now.</h2>
            <p className="text-xl font-newsreader text-on-surface-variant max-w-xl mx-auto mb-16 italic">
              Take your personal writing coach with you. Available soon for native Android and iOS environments.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="group flex items-center gap-4 px-8 py-5 bg-surface-container border border-outline-variant/20 rounded-2xl hover:border-primary/40 transition-all opacity-50 cursor-not-allowed">
                <Apple className="w-8 h-8 text-on-surface" />
                <div className="text-left">
                  <div className="text-[10px] font-space font-black uppercase tracking-widest text-on-surface-variant">Coming soon to</div>
                  <div className="font-space font-bold text-lg uppercase tracking-tight">App Store</div>
                </div>
              </button>

              <button className="group flex items-center gap-4 px-8 py-5 bg-surface-container border border-outline-variant/20 rounded-2xl hover:border-secondary/40 transition-all opacity-50 cursor-not-allowed">
                <Smartphone className="w-8 h-8 text-on-surface" />
                <div className="text-left">
                  <div className="text-[10px] font-space font-black uppercase tracking-widest text-on-surface-variant">Coming soon to</div>
                  <div className="font-space font-bold text-lg uppercase tracking-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-12 border-t border-outline-variant/10 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <PenTool className="text-primary w-5 h-5 opacity-50" />
              <span className="font-space font-black uppercase tracking-widest text-xs opacity-50">WritingCoach © 2026</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-[10px] font-space font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-[10px] font-space font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Privacy Protocol</a>
              <a href="#" className="text-[10px] font-space font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">System Status</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
