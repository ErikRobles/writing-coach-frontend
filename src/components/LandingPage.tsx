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
  Apple, 
  X, 
  Loader2, 
  ArrowRight 
} from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPaypalOrder, capturePaypalOrder, createMPPreference, API_BASE_URL } from '../api';
import '../App.css';

const PAYPAL_CLIENT_ID = (import.meta as any).env.VITE_PAYPAL_CLIENT_ID || "test";

export default function LandingPage() {
  const [selectedTier, setSelectedTier] = useState<null | 'free' | 'basic' | 'pro' | 'premium' | 'corporate'>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const { login, token } = useAuth();
  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    const url = authMode === 'login' ? `${API_BASE_URL}/login` : `${API_BASE_URL}/signup`;
    console.log(`Attempting ${authMode} at: ${url}`);
    
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
        // Send the selected tier if coming from pricing, otherwise default to free
        const signupTier = selectedTier || 'free';
        body = JSON.stringify({ email, password, tier: signupTier });
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
      login(data.access_token, data.role, currentEmail);
      
      // If we are NOT in the modal (hero flow), just navigate.
      if (!showPlanModal) {
        navigate('/chat');
      }
      // If we ARE in the modal, the re-render based on 'token' will handle the transition.

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMPPayment = async (tier: string) => {
    setIsProcessing(true);
    try {
      const { init_point } = await createMPPreference(tier);
      window.location.href = init_point;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePricingClick = (tier: string) => {
    setSelectedTier(tier as any);
    setError('');
    setPaymentSuccess(false);
    setShowPlanModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-inter selection:bg-primary/30 relative overflow-x-hidden">

      {/* Background Pattern Layers */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 aztec-pattern"></div>
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
                Write English with <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-container to-tertiary">Confidence.</span>
              </h2>
              <p className="text-xl md:text-2xl font-newsreader text-on-surface-variant leading-relaxed max-w-lg italic">
                Improve your English writing every day. Fix your mistakes, learn new words, and see your progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => { setAuthMode('signup'); setSelectedTier('free'); setError(''); }}
                className="px-8 py-4 bg-primary text-on-primary-fixed font-space font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-primary/20"
              >
                Start for Free
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('pricing');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-surface-container-high text-on-surface-variant font-space font-bold uppercase tracking-widest text-xs rounded-xl hover:text-on-surface border border-outline-variant/20 transition-all active:scale-95"
              >
                View Pricing
              </button>
            </div>
          </div>

          {/* Login / Signup Flow */}
          <div className="flex flex-col justify-center w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-surface-container-low/40 backdrop-blur-3xl p-10 rounded-[40px] border border-on-surface/5 shadow-[0_48px_96px_rgba(0,0,0,0.6)]">
              <div className="flex w-full mb-8 bg-surface-container-lowest/50 rounded-2xl p-1.5 border border-outline-variant/10">
                {token ? (
                  <div className="flex-1 py-3 text-center text-primary font-space font-black uppercase tracking-widest text-xs">
                    You are logged in
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => { setAuthMode('signup'); setSelectedTier('free'); setError(''); }}
                      className={`flex-1 py-3 font-space font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${authMode === 'signup' ? 'bg-primary text-on-primary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => { setAuthMode('login'); setError(''); }}
                      className={`flex-1 py-3 font-space font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${authMode === 'login' ? 'bg-primary text-on-primary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Log In
                    </button>
                  </>
                )}
              </div>

              {token ? (
                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="font-space font-black uppercase tracking-widest text-sm text-center">Welcome Back</h3>
                  <button onClick={() => navigate('/chat')} className="w-full bg-primary text-on-primary-fixed font-space font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-primary/20">
                    Go to Chat
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-space font-black uppercase tracking-widest text-xs text-on-surface-variant">
                      {authMode === 'login' ? 'Authentication' : (selectedTier === 'free' || !selectedTier ? 'Join for Free' : `${selectedTier?.toUpperCase()} Registration`)}
                    </h3>
                    {authMode === 'signup' && selectedTier && selectedTier !== 'free' && (
                      <button type="button" onClick={() => setSelectedTier('free')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                        Switch to free
                      </button>
                    )}
                  </div>

                  {error && <div className="text-red-400 text-[10px] font-space font-black uppercase tracking-widest bg-red-400/5 p-4 rounded-xl border border-red-400/20">{error}</div>}

                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-space font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Email</label>
                      <input required type="email" placeholder="YOU@EMAIL.COM" value={email} onChange={e => setEmail(e.target.value)} className="bg-surface-container border border-outline-variant/20 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/20 font-space text-sm" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-space font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Password</label>
                      <input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-surface-container border border-outline-variant/20 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/20 font-space text-sm" />
                    </div>
                  </div>

                  <button type="submit" disabled={isProcessing} className="w-full bg-primary text-on-primary-fixed font-space font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {authMode === 'login' ? 'Login' : (selectedTier === 'free' || !selectedTier ? 'Start for Free' : `Register - ${selectedTier?.toUpperCase()}`)}
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
              <h2 className="text-5xl md:text-7xl font-space font-black tracking-tighter uppercase leading-none">Improve your <span className="italic text-on-surface-variant/50 font-newsreader lowercase">English</span> skills.</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-6 p-8 rounded-[32px] bg-surface-container border border-outline-variant/5 hover:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="text-primary w-6 h-6" />
                </div>
                <h4 className="font-space font-bold uppercase tracking-tight text-xl">Quick Corrections</h4>
                <p className="font-newsreader text-on-surface-variant text-lg leading-relaxed">Fix your spelling and grammar in seconds. Learn the right way to write in American English.</p>
              </div>

              <div className="space-y-6 p-8 rounded-[32px] bg-surface-container border border-outline-variant/5 hover:border-secondary/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <ShieldCheck className="text-secondary w-6 h-6" />
                </div>
                <h4 className="font-space font-bold uppercase tracking-tight text-xl">Better Style</h4>
                <p className="font-newsreader text-on-surface-variant text-lg leading-relaxed">Choose between formal or informal writing. We help you sound natural in every situation.</p>
              </div>

              <div className="space-y-6 p-8 rounded-[32px] bg-surface-container border border-outline-variant/5 hover:border-tertiary/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
                  <TrendingUp className="text-tertiary w-6 h-6" />
                </div>
                <h4 className="font-space font-bold uppercase tracking-tight text-xl">Track Your Growth</h4>
                <p className="font-newsreader text-on-surface-variant text-lg leading-relaxed">See how much you improve over time. Our charts show your progress every step of the way.</p>
              </div>

              <div className="space-y-6 p-8 rounded-[32px] bg-surface-container border border-outline-variant/5 hover:border-indigo-400/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-400/10 flex items-center justify-center">
                  <Mail className="text-indigo-400 w-6 h-6" />
                </div>
                <h4 className="font-space font-bold uppercase tracking-tight text-xl">Weekly Tips</h4>
                <p className="font-newsreader text-on-surface-variant text-lg leading-relaxed">Receive a report every Monday. Find out what mistakes you make most and how to fix them.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section id="pricing" className="bg-background py-24 md:py-48 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-tertiary/20 blur-[100px] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <header className="mb-24 text-center">
              <h3 className="font-space font-black text-xs tracking-[0.4em] text-primary uppercase mb-6">Simple Pricing</h3>
              <h2 className="text-5xl md:text-7xl font-space font-black tracking-tighter uppercase leading-none">Choose your <span className="italic text-on-surface-variant/50 font-newsreader lowercase">Plan</span>.</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Free Tier */}
              <div className="p-8 rounded-[40px] bg-surface-container border border-outline-variant/5 hover:border-primary/20 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-space font-black text-2xl text-on-surface uppercase tracking-tight">Free</h4>
                    <p className="text-[10px] text-on-surface-variant opacity-70 uppercase tracking-widest">Great for starters</p>
                  </div>
                  <span className="text-2xl font-black bg-surface-bright px-4 py-1 rounded-full border border-outline-variant/20">$0</span>
                </div>
                <div className="flex-1 space-y-4 mb-10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-inter text-sm">50 tokens</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-inter text-sm">Basic Grammar Fixes</span>
                  </div>
                </div>
                <button 
                  onClick={() => handlePricingClick('free')}
                  className="w-full py-4 bg-surface-container-high text-on-surface font-space font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary hover:text-on-primary-fixed transition-all"
                >
                  Get Started
                </button>
              </div>

              {/* Basic Tier */}
              <div className="p-8 rounded-[40px] bg-surface-container border border-outline-variant/5 hover:border-primary/20 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-space font-black text-2xl text-on-surface uppercase tracking-tight">Basic</h4>
                    <p className="text-[10px] text-on-surface-variant opacity-70 uppercase tracking-widest">More practice</p>
                  </div>
                  <span className="text-2xl font-black bg-surface-bright px-4 py-1 rounded-full border border-outline-variant/20">$5</span>
                </div>
                <div className="flex-1 space-y-4 mb-10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-inter text-sm">300 tokens</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-inter text-sm">All Styles</span>
                  </div>
                </div>
                <button 
                  onClick={() => handlePricingClick('basic')}
                  className="w-full py-4 bg-surface-container-high text-on-surface font-space font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary hover:text-on-primary-fixed transition-all"
                >
                  Choose Basic
                </button>
              </div>

              {/* Pro Tier */}
              <div className="p-8 rounded-[40px] bg-surface-container-high border border-primary/20 hover:border-emerald-400 transition-all flex flex-col h-full relative overflow-hidden shadow-2xl shadow-primary/10">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary to-emerald-400"></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-space font-black text-2xl text-on-surface uppercase tracking-tight">Pro</h4>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Most Popular</p>
                  </div>
                  <span className="text-2xl font-black bg-primary text-on-primary-fixed px-4 py-1 rounded-full">$12</span>
                </div>
                <div className="flex-1 space-y-4 mb-10">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary fill-primary" />
                    <span className="font-inter text-sm font-bold">1000 tokens</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-inter text-sm">AI Tutor Analysis</span>
                  </div>
                </div>
                <button 
                  onClick={() => handlePricingClick('pro')}
                  className="w-full py-4 bg-primary text-on-primary-fixed font-space font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-primary/20"
                >
                  Choose Pro
                </button>
              </div>

              {/* Premium Tier */}
              <div className="p-8 rounded-[40px] bg-surface-container border border-outline-variant/5 hover:border-primary/20 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-space font-black text-2xl text-on-surface uppercase tracking-tight">Premium</h4>
                    <p className="text-[10px] text-on-surface-variant opacity-70 uppercase tracking-widest">Power user</p>
                  </div>
                  <span className="text-2xl font-black bg-surface-bright px-4 py-1 rounded-full border border-outline-variant/20">$30</span>
                </div>
                <div className="flex-1 space-y-4 mb-10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-inter text-sm">5000 tokens</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-inter text-sm">Personalized Coaching</span>
                  </div>
                </div>
                <button 
                  onClick={() => handlePricingClick('premium')}
                  className="w-full py-4 bg-surface-container-high text-on-surface font-space font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary hover:text-on-primary-fixed transition-all"
                >
                  Choose Premium
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setSelectedTier('corporate')}
                className="text-xs font-space font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
              >
                Need a corporate plan? Contact us
              </button>
            </div>
          </div>
        </section>

        {/* --- PLAN MODAL --- */}
        {showPlanModal && selectedTier && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-surface-container border border-primary/20 rounded-[32px] w-full max-w-md p-8 flex flex-col shadow-[0px_0px_50px_rgba(0,255,200,0.1)] relative">
              <button onClick={() => { setShowPlanModal(false); setPaymentSuccess(false); setError(''); }} className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-on-surface transition-colors">
                <X className="w-6 h-6" />
              </button>

              {!token ? (
                /* STEP 1: Registration Form */
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <PenTool className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-space font-black text-xl text-on-surface uppercase tracking-tight">
                        {selectedTier === 'free' ? 'Join for Free' : `Register - ${selectedTier.toUpperCase()}`}
                      </h2>
                      <p className="text-[10px] font-space font-bold text-primary uppercase tracking-widest italic">Create account to continue</p>
                    </div>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-6">
                    {error && <div className="text-red-400 text-[10px] font-space font-black uppercase tracking-widest bg-red-400/5 p-4 rounded-xl border border-red-400/20">{error}</div>}

                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-space font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Email</label>
                        <input required type="email" placeholder="YOU@EMAIL.COM" value={email} onChange={e => setEmail(e.target.value)} className="bg-surface-container-highest border border-outline-variant/20 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/20 font-space text-sm" />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-space font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Password</label>
                        <input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-surface-container-highest border border-outline-variant/20 rounded-2xl px-5 py-4 text-on-surface focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/20 font-space text-sm" />
                      </div>
                    </div>

                    <button type="submit" disabled={isProcessing} className="w-full bg-primary text-on-primary-fixed font-space font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50">
                      {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                      Create Account
                    </button>
                  </form>
                </div>
              ) : selectedTier === 'free' || paymentSuccess ? (
                /* STEP 2 (FREE or PAID SUCCESS): Welcome / Success Message */
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in">
                  <div className="w-20 h-20 rounded-full bg-emerald-400/20 flex items-center justify-center mb-6 border border-emerald-400/30">
                    <CheckCircle2 className="text-emerald-400 w-10 h-10" />
                  </div>
                  <h3 className="font-space font-black text-xl text-center uppercase mb-2">
                    {paymentSuccess ? 'Payment Received' : 'You\'re All Set!'}
                  </h3>
                  <p className="font-newsreader text-lg text-on-surface-variant text-center mb-8 italic leading-relaxed">
                    {paymentSuccess 
                      ? `Your account has been upgraded to the ${selectedTier?.toUpperCase()} plan. Enjoy your new tokens!`
                      : 'Welcome to WritingCoach! You have 50 tokens to start improving your English writing.'}
                  </p>
                  <button onClick={() => navigate('/chat')} className="w-full bg-primary text-on-primary-fixed font-space font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3">
                    Start Writing Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* STEP 2 (PAID): Payment Selection */
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-space font-black text-xl text-on-surface uppercase tracking-tight">Secure Payment</h2>
                      <p className="text-xs font-space font-bold text-primary uppercase tracking-widest">{selectedTier.toUpperCase()} PLAN • MXN ${selectedTier === 'basic' ? '5.00' : selectedTier === 'pro' ? '12.00' : '30.00'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-surface-container-highest/50 p-6 rounded-2xl border border-outline-variant/10">
                      <p className="font-newsreader text-lg text-on-surface-variant mb-6 text-center italic">Choose your preferred payment method below to complete your upgrade.</p>
                      
                      <div className="space-y-4">
                        <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "MXN" }}>
                          <PayPalButtons 
                            style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
                            createOrder={() => createPaypalOrder(selectedTier)}
                            onApprove={async (data) => {
                              const details = await capturePaypalOrder(data.orderID, selectedTier);
                              if (details.status === "COMPLETED") {
                                setPaymentSuccess(true);
                              }
                            }}
                          />
                        </PayPalScriptProvider>

                        <div className="flex items-center gap-4 py-2">
                          <div className="h-px flex-1 bg-outline-variant/10"></div>
                          <span className="text-[10px] font-space font-black text-on-surface-variant uppercase tracking-widest">or</span>
                          <div className="h-px flex-1 bg-outline-variant/10"></div>
                        </div>

                        {/* Mercado Pago Integration - Hidden until credentials are ready */}
                        <button 
                          disabled
                          className="w-full py-4 bg-surface-container-highest text-on-surface-variant font-space font-black uppercase tracking-widest text-[10px] rounded-xl border border-outline-variant/10 flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                        >
                          <CreditCard className="w-4 h-4" />
                          Mercado Pago (Coming Soon)
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-[10px] font-space font-bold text-on-surface-variant/40 text-center uppercase tracking-widest">
                      Your payment is secure and encrypted.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- DOWNLOAD SECTION --- */}
        <section className="py-24 md:py-48 bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h3 className="font-space font-black text-xs tracking-[0.4em] text-secondary uppercase mb-8">Learn anywhere</h3>
            <h2 className="text-5xl md:text-7xl font-space font-black tracking-tighter uppercase leading-none mb-12">Download the <br/>app now.</h2>
            <p className="text-xl font-newsreader text-on-surface-variant max-w-xl mx-auto mb-16 italic">
              Take your coach with you. Coming soon for Android and iOS phones.
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
              <a href="#" className="text-[10px] font-space font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Terms of Use</a>
              <a href="#" className="text-[10px] font-space font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-[10px] font-space font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">System Status</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
