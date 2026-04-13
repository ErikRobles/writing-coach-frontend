import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { getUserStats } from '../api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tier = searchParams.get('tier') || 'Pro';
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verify stats update and redirect
    const verify = async () => {
      try {
        await getUserStats();
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-on-surface relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[160px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-surface-container/40 backdrop-blur-3xl p-10 rounded-[40px] border border-primary/20 shadow-[0_48px_96px_rgba(0,0,0,0.6)] relative z-10 text-center animate-in zoom-in duration-500">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="font-space font-black text-2xl uppercase tracking-tight">Verifying Upgrade...</h2>
          </div>
        ) : (
          <>
            <div className="w-24 h-24 rounded-full bg-emerald-400/20 flex items-center justify-center mb-8 border border-emerald-400/30 mx-auto">
              <CheckCircle2 className="text-emerald-400 w-12 h-12" />
            </div>

            <h1 className="text-4xl font-space font-black tracking-tighter uppercase mb-4">
              Payment <span className="text-primary">Successful!</span>
            </h1>
            
            <p className="font-newsreader text-xl text-on-surface-variant mb-10 leading-relaxed italic">
              Your account has been upgraded to the <span className="text-primary font-bold uppercase">{tier}</span> plan. 
              You can now enjoy all your new features and tokens.
            </p>

            <div className="bg-surface-container-highest/50 p-6 rounded-2xl border border-outline-variant/10 mb-10 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="text-primary w-5 h-5 fill-primary" />
              </div>
              <div>
                <p className="text-[10px] font-space font-black text-on-surface-variant uppercase tracking-widest">Active Plan</p>
                <p className="font-space font-bold text-lg uppercase tracking-tight">{tier}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/chat')}
              className="w-full py-5 bg-primary text-on-primary-fixed font-space font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group"
            >
              Start Writing Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}

        {error && (
          <p className="mt-6 text-red-400 text-[10px] font-space font-black uppercase tracking-widest bg-red-400/5 p-4 rounded-xl border border-red-400/20">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
