import React from 'react';
import { IndianRupee, Zap, ShieldCheck, ThumbsUp, ThumbsDown, Bookmark, ExternalLink } from 'lucide-react';

export default function RecommendationCard({ recommendation, index, onCompareToggle, isSelected }) {
  // Defensive destructuring with defaults
  const { 
    name = 'Unknown Appliance', 
    brand = 'Unknown Brand', 
    price = 0, 
    energy_rating = 'N/A', 
    reason = 'No reason provided.', 
    pros = [], 
    cons = [] 
  } = recommendation || {};

  // Ensure price is a number for toLocaleString
  const displayPrice = typeof price === 'number' 
    ? price.toLocaleString() 
    : String(price).replace(/[^\d]/g, '') || '0';

  return (
    <div className="gh-card p-6 flex flex-col relative group overflow-hidden animate-fade-in" 
         style={{ animationDelay: `${index * 100}ms` }}>
      
      {/* Selection Overlay for Comparison */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => onCompareToggle(recommendation)}
            className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-offset-gray-900"
          />
          <span className="text-xs font-semibold uppercase" style={{ color: isSelected ? '#388bfd' : '#8b949e' }}>Compare</span>
        </label>
        <button className="p-2 rounded-full transition-colors" style={{ backgroundColor: '#21262d' }}>
          <Bookmark className="w-4 h-4" style={{ color: '#8b949e' }} />
        </button>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#388bfd' }}>Recommendation #{index + 1}</span>
          <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{name}</h3>
          <p className="text-sm" style={{ color: '#8b949e' }}>{brand}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#0d1117', border: '1px solid #21262d' }}>
          <div className="flex items-center gap-2 mb-1" style={{ color: '#3fb950' }}>
            <IndianRupee className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Price</span>
          </div>
          <p className="text-lg font-bold text-white">₹{displayPrice}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#0d1117', border: '1px solid #21262d' }}>
          <div className="flex items-center gap-2 mb-1" style={{ color: '#f59e0b' }}>
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Energy</span>
          </div>
          <p className="text-lg font-bold text-white">{energy_rating}</p>
        </div>
      </div>

      <div className="mb-6 flex-1">
        <p className="text-sm italic mb-4 p-3 rounded-lg leading-relaxed" style={{ backgroundColor: 'rgba(56,139,253,0.05)', color: '#c9d1d9', borderLeft: '3px solid #388bfd' }}>
          "{reason}"
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2" style={{ color: '#3fb950' }}>
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Pros</span>
            </div>
            <ul className="text-sm space-y-1">
              {Array.isArray(pros) && pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2" style={{ color: '#c9d1d9' }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#3fb950' }}></span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2" style={{ color: '#f85149' }}>
              <ThumbsDown className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Cons</span>
            </div>
            <ul className="text-sm space-y-1">
              {Array.isArray(cons) && cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2" style={{ color: '#c9d1d9' }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#f85149' }}></span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button className="gh-btn-secondary w-full mt-2 group-hover:bg-blue-500/10 group-hover:border-blue-500/50 transition-all">
        View Best Price <ExternalLink className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
}
