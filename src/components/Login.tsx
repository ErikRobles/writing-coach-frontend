import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { PenTool } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const url = isLogin ? 'http://localhost:8080/login' : 'http://localhost:8080/signup';
    
    try {
      let body;
      let headers = {};
      
      if (isLogin) {
        // OAuth2PasswordRequestForm requires form data
        const formData = new URLSearchParams();
        formData.append('username', email); // send as 'username' to coax FastAPI OAuth2
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
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/chat');
      }
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-on-surface">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-surface-variant flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform cursor-pointer border border-primary/20">
            <PenTool className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-space-grotesk font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-emerald-400">
            {isLogin ? 'Access Scribe' : 'Join Scribe'}
          </h1>
          <p className="font-inter text-sm text-on-surface-variant max-w-[280px] text-center">
            The Cyber-Modern digital atelier. Elevate your narrative arc and refine technical precision.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-surface/40 p-6 rounded-3xl border border-on-surface/5 backdrop-blur-xl shadow-2xl">
          {error && <div className="text-red-400 text-sm font-inter bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</div>}
          
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-inter font-medium text-on-surface-variant uppercase tracking-wider ml-1">Email Address</label>
            <input 
              required
              type="email"
              className="bg-background/80 border border-on-surface/10 rounded-2xl px-4 py-3 text-on-surface font-inter focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50"
              placeholder="admin@scribe.ai"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-inter font-medium text-on-surface-variant uppercase tracking-wider ml-1">Secure Passkey</label>
            <input 
              required
              type="password"
              className="bg-background/80 border border-on-surface/10 rounded-2xl px-4 py-3 text-on-surface font-inter focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="mt-4 bg-primary text-background font-space-grotesk font-bold py-3.5 rounded-2xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(0,253,198,0.2)]">
            {isLogin ? 'Initialize Uplink' : 'Register Identity'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-inter text-on-surface-variant">
          {isLogin ? 'No active dossier? ' : 'Returning author? '}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary hover:text-emerald-300 transition-colors font-medium border-b border-primary/30 pb-0.5"
          >
            {isLogin ? 'Request Access' : 'Login Here'}
          </button>
        </p>
      </div>
    </div>
  );
}
