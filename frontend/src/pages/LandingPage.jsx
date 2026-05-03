import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BarChart2, Bookmark, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gh-bg text-gh-text flex flex-col">
      <nav className="p-6 flex justify-between items-center border-b border-gh-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-gh-blue" />
          <h1 className="font-bold text-xl tracking-tight text-white">Appliance<span className="text-gh-blue">AI</span></h1>
        </div>
        <Link to="/login" className="gh-btn-secondary">Log In</Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Find Your Perfect <br/>
          <span className="text-gh-blue">Home Appliance</span>
        </h1>
        <p className="text-xl text-gh-muted max-w-2xl mb-10">
          Powered by advanced AI to match your exact needs, room size, and budget. Compare side-by-side and save money on energy bills.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="gh-btn-primary px-8 py-4 text-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl">
          <div className="gh-card p-6 text-left hover:border-gh-blue transition-colors">
            <Sparkles className="w-8 h-8 text-gh-blue mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI Powered</h3>
            <p className="text-gh-muted">Get highly personalized recommendations based on real-world usage and complex parameters.</p>
          </div>
          <div className="gh-card p-6 text-left hover:border-gh-blue transition-colors">
            <BarChart2 className="w-8 h-8 text-gh-green mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Compare Side-by-Side</h3>
            <p className="text-gh-muted">Generate instant comparison tables to evaluate specs, pros, cons, and lifetime energy costs.</p>
          </div>
          <div className="gh-card p-6 text-left hover:border-gh-blue transition-colors">
            <Bookmark className="w-8 h-8 text-[#f85149] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Save & Track</h3>
            <p className="text-gh-muted">Automatically log your search history and bookmark your favorite appliances for later.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
