import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { PenTool } from 'lucide-react';
import { API_BASE_URL } from '../api';

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

    const url = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/signup`;
    console.log(`Attempting ${isLogin ? 'login' : 'signup'} at: ${url}`);
    
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
      // Use the role returned from the backend
      login(data.access_token, data.role, currentEmail);

      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/chat');
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-on-surface">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-surface-variant flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform cursor-pointer border border-primary/20">
            <PenTool className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-space font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-emerald-400">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h1>
          <p className="font-inter text-sm text-on-surface-variant max-w-[280px] text-center">
            Welcome to WritingTutor. Improve your writing easily and confidently with your friendly AI tutor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-surface/40 p-6 rounded-3xl border border-on-surface/5 backdrop-blur-xl shadow-2xl">
          {error && <div className="text-red-400 text-sm font-inter bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</div>}

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-inter font-medium text-on-surface-variant uppercase tracking-wider ml-1">Email Address</label>
            <input
              required
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              className="bg-background/80 border border-on-surface/10 rounded-2xl px-4 py-3 text-on-surface font-inter focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50"

              placeholder="admin@writingtutor.website"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-inter font-medium text-on-surface-variant uppercase tracking-wider ml-1">Password</label>
            <input
              required
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              className="bg-background/80 border border-on-surface/10 rounded-2xl px-4 py-3 text-on-surface font-inter focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50"

              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="mt-4 bg-primary text-background font-space font-bold py-3.5 rounded-2xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(0,253,198,0.2)]">
            {isLogin ? 'Log in' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-inter text-on-surface-variant">
          {isLogin ? 'Need an account? ' : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-emerald-300 transition-colors font-medium border-b border-primary/30 pb-0.5"
          >
            {isLogin ? 'Sign up here' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
}
