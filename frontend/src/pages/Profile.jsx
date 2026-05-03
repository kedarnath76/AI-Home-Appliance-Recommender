import React, { useState, useEffect } from 'react';
import { User, Mail, ShieldAlert, LogOut, Settings, History, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clearHistory, getHistory, getWishlist } from '../api';

export default function Profile() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ historyCount: 0, wishlistCount: 0 });
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    Promise.all([getHistory(), getWishlist()]).then(([history, wishlist]) => {
      setStats({
        historyCount: history.length,
        wishlistCount: wishlist.length
      });
    }).catch(console.error);
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure? This will permanently delete all your past recommendations.")) return;
    setIsClearing(true);
    try {
      await clearHistory();
      setStats(prev => ({ ...prev, historyCount: 0 }));
      alert("History cleared successfully.");
    } catch (err) {
      alert("Failed to clear history.");
    } finally {
      setIsClearing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Your Profile</h2>
          <p style={{ color: '#8b949e' }}>Manage your account and preferences.</p>
        </div>
        <button onClick={logout} className="gh-btn-secondary border-red-500/50 text-red-400 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="gh-card p-6 md:col-span-1 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 border-4" 
               style={{ backgroundColor: 'rgba(56,139,253,0.1)', color: '#388bfd', borderColor: '#0d1117' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
          <p className="text-sm mb-4" style={{ color: '#8b949e' }}>{user.email}</p>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-6" style={{ backgroundColor: '#21262d' }}>
            Pro Member
          </div>
          
          <div className="pt-4 text-left" style={{ borderTop: '1px solid #21262d' }}>
            <p className="text-sm flex justify-between mb-2" style={{ color: '#8b949e' }}>
              <span className="flex items-center gap-2"><History className="w-4 h-4" /> History</span>
              <span className="text-white font-bold">{stats.historyCount}</span>
            </p>
            <p className="text-sm flex justify-between mb-2" style={{ color: '#8b949e' }}>
              <span className="flex items-center gap-2"><Bookmark className="w-4 h-4" /> Wishlist</span>
              <span className="text-white font-bold">{stats.wishlistCount}</span>
            </p>
            <p className="text-sm flex justify-between" style={{ color: '#8b949e' }}>
              <span className="flex items-center gap-2"><User className="w-4 h-4" /> Member Since</span>
              <span className="text-white font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="gh-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" style={{ color: '#388bfd' }} /> Default Preferences
            </h3>
            <p className="text-sm mb-4" style={{ color: '#8b949e' }}>These settings will be pre-filled in your recommendation forms.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#c9d1d9' }}>Preferred City / Climate</label>
                  <input type="text" className="gh-input w-full" placeholder="e.g. Mumbai (Humid)" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#c9d1d9' }}>Default Energy Rating</label>
                  <select className="gh-input w-full">
                    <option>No Preference</option>
                    <option>5 Star Only</option>
                    <option>4 Star & Above</option>
                  </select>
                </div>
              </div>
              <button className="gh-btn-secondary mt-2">Save Preferences</button>
            </div>
          </div>

          <div className="gh-card p-6 relative overflow-hidden" style={{ borderColor: 'rgba(248,81,73,0.3)' }}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert className="w-16 h-16" style={{ color: '#f85149' }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#f85149' }}>Danger Zone</h3>
            <p className="text-sm mb-4 max-w-md" style={{ color: '#8b949e' }}>
              Once you delete your history, there is no going back. Please be certain.
            </p>
            <button 
              onClick={handleClearHistory}
              disabled={isClearing}
              className="bg-transparent font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 border"
              style={{ borderColor: '#f85149', color: '#f85149' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(248,81,73,0.1)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <History className="w-4 h-4" /> {isClearing ? 'Clearing...' : 'Clear All History'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
