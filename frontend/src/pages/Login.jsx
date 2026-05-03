import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gh-bg flex items-center justify-center p-6">
      <div className="gh-card w-full max-w-md p-8 relative overflow-hidden group">
        <div className="absolute inset-0 border-2 border-transparent group-focus-within:border-gh-blue rounded-xl transition-colors duration-500 pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-8 text-center">
          <Sparkles className="w-10 h-10 text-gh-blue mb-4" />
          <h2 className="text-2xl font-bold text-white">Sign in to ApplianceAI</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-gh-red/10 border border-gh-red text-gh-red rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gh-muted" />
              <input 
                type="email" 
                required
                className="gh-input w-full pl-10" 
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gh-muted" />
              <input 
                type="password" 
                required
                className="gh-input w-full pl-10" 
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="gh-btn-primary w-full mt-6">Sign in</button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="h-px bg-gh-border flex-1"></span>
          <span className="text-xs text-gh-muted uppercase">or</span>
          <span className="h-px bg-gh-border flex-1"></span>
        </div>

        <button className="gh-btn-secondary w-full mt-6 gap-3">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-sm text-gh-muted">
          New to ApplianceAI? <Link to="/register" className="text-gh-blue hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
