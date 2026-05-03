import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { clearHistory } from '../api';
import { User, Trash2, Settings, ShieldAlert } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [clearing, setClearing] = useState(false);

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to permanently delete all your search history?")) {
      setClearing(true);
      try {
        await clearHistory();
        alert("History cleared successfully.");
      } catch (err) {
        alert("Failed to clear history.");
      } finally {
        setClearing(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in pb-20 md:pb-0 max-w-4xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile & Settings</h1>
        <p className="text-gh-muted">Manage your account and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="gh-card p-6 md:col-span-1 text-center">
          <div className="w-24 h-24 rounded-full bg-gh-blue/20 text-gh-blue flex items-center justify-center text-4xl font-bold mx-auto mb-4 border-4 border-gh-bg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-gh-muted text-sm mb-4">{user.email}</p>
          <div className="inline-block bg-gh-border px-3 py-1 rounded-full text-xs font-semibold text-white mb-6">
            Pro Plan
          </div>
          
          <div className="border-t border-gh-border pt-4 text-left">
            <p className="text-sm text-gh-muted flex justify-between mb-2">
              <span>Member since:</span>
              <span className="text-white font-medium">{new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
            </p>
            <p className="text-sm text-gh-muted flex justify-between mb-2">
              <span>Total Searches:</span>
              <span className="text-white font-medium">{user.stats?.totalSearches || 0}</span>
            </p>
            <p className="text-sm text-gh-muted flex justify-between">
              <span>Saved Items:</span>
              <span className="text-white font-medium">{user.stats?.totalSaved || 0}</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Preferences */}
          <div className="gh-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gh-blue" /> Default Preferences
            </h3>
            <p className="text-sm text-gh-muted mb-4">These settings will be pre-filled in your recommendation forms.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">Preferred City / Climate</label>
                <input type="text" className="gh-input w-full max-w-md" placeholder="e.g. Mumbai (Humid)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">Default Energy Rating</label>
                <select className="gh-input w-full max-w-md">
                  <option>5 Star</option>
                  <option>4 Star</option>
                  <option>3 Star</option>
                </select>
              </div>
              <button className="gh-btn-secondary mt-2">Save Preferences</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="gh-card border-gh-red/30 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <ShieldAlert className="w-16 h-16 text-gh-red/10" />
            </div>
            <h3 className="text-lg font-bold text-gh-red mb-2">Danger Zone</h3>
            <p className="text-sm text-gh-muted mb-4 max-w-md">
              Permanently delete your search history. This action cannot be undone and will reset your AI Insights.
            </p>
            <button 
              onClick={handleClearHistory} 
              disabled={clearing}
              className="bg-transparent hover:bg-gh-red/10 border border-gh-red text-gh-red font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {clearing ? 'Clearing...' : 'Clear Search History'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
