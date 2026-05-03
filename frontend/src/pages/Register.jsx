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
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gh-bg flex items-center justify-center p-6">
      <div className="gh-card w-full max-w-md p-8 relative overflow-hidden group">
        <div className="absolute inset-0 border-2 border-transparent group-focus-within:border-gh-blue rounded-xl transition-colors duration-500 pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-8 text-center">
          <Sparkles className="w-10 h-10 text-gh-blue mb-4" />
          <h2 className="text-2xl font-bold text-white">Create an account</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-gh-red/10 border border-gh-red text-gh-red rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gh-muted" />
              <input 
                type="text" 
                required
                className="gh-input w-full pl-10" 
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gh-muted" />
              <input 
                type="password" 
                required
                className="gh-input w-full pl-10" 
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="gh-btn-primary w-full mt-6">Register</button>
        </form>

        <p className="mt-8 text-center text-sm text-gh-muted">
          Already have an account? <Link to="/login" className="text-gh-blue hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
