import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BarChart2, Bookmark, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0d1117', color: '#c9d1d9' }}>
      <nav className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid #21262d' }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" style={{ color: '#388bfd' }} />
          <h1 className="font-bold text-xl tracking-tight text-white">
            Appliance<span style={{ color: '#388bfd' }}>AI</span>
          </h1>
        </div>
        <Link to="/login" className="gh-btn-secondary">Log In</Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 py-20">
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Find Your Perfect<br />
          <span style={{ color: '#388bfd' }}>Home Appliance</span>
        </h2>
        <p className="text-xl max-w-2xl mb-10" style={{ color: '#8b949e' }}>
          Powered by advanced AI to match your exact needs, room size, and budget. 
          Compare side-by-side and save money on energy bills.
        </p>

        <Link to="/register" className="gh-btn-primary px-8 py-4 text-lg">
          Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
          <div className="gh-card p-6 text-left hover:border-blue-500/50 transition-colors">
            <Sparkles className="w-8 h-8 mb-4" style={{ color: '#388bfd' }} />
            <h3 className="text-xl font-bold text-white mb-2">AI Powered</h3>
            <p style={{ color: '#8b949e' }}>Get highly personalized recommendations based on real-world usage and complex parameters.</p>
          </div>
          <div className="gh-card p-6 text-left hover:border-blue-500/50 transition-colors">
            <BarChart2 className="w-8 h-8 mb-4" style={{ color: '#3fb950' }} />
            <h3 className="text-xl font-bold text-white mb-2">Compare Side-by-Side</h3>
            <p style={{ color: '#8b949e' }}>Generate instant comparison tables to evaluate specs, pros, cons, and lifetime energy costs.</p>
          </div>
          <div className="gh-card p-6 text-left hover:border-blue-500/50 transition-colors">
            <Bookmark className="w-8 h-8 mb-4" style={{ color: '#f85149' }} />
            <h3 className="text-xl font-bold text-white mb-2">Save & Track</h3>
            <p style={{ color: '#8b949e' }}>Automatically log your search history and bookmark your favorite appliances for later.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
