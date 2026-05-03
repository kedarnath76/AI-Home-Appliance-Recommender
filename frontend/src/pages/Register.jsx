import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Registration failed. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#0d1117' }}>
      <div className="gh-card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8 text-center">
          <Sparkles className="w-10 h-10 mb-4" style={{ color: '#388bfd' }} />
          <h2 className="text-2xl font-bold text-white">Create an account</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm border" style={{ background: 'rgba(248,81,73,0.1)', borderColor: '#f85149', color: '#f85149' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#c9d1d9' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5" style={{ color: '#8b949e' }} />
              <input
                type="text"
                required
                className="gh-input pl-10"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#c9d1d9' }}>Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5" style={{ color: '#8b949e' }} />
              <input
                type="email"
                required
                className="gh-input pl-10"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#c9d1d9' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5" style={{ color: '#8b949e' }} />
              <input
                type="password"
                required
                className="gh-input pl-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#c9d1d9' }}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5" style={{ color: '#8b949e' }} />
              <input
                type="password"
                required
                className="gh-input pl-10"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="gh-btn-primary w-full mt-6">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm" style={{ color: '#8b949e' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#388bfd' }} className="hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
