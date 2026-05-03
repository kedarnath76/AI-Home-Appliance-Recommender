import React, { useState, useEffect } from 'react';
import { Check, X, Zap, Tag, Info, Bookmark, Calendar } from 'lucide-react';
import { toggleWishlist, getWishlist } from '../api';

export default function RecommendationCard({ recommendation, index, onCompareToggle, isSelected }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if initially saved
    getWishlist().then(list => {
      if (list.some(item => item.appliance_name === recommendation.name)) {
        setIsSaved(true);
      }
    }).catch(console.error);
  }, [recommendation.name]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await toggleWishlist({ 
        appliance_name: recommendation.name, 
        brand: recommendation.brand,
        details: recommendation 
      });
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`gh-card p-6 relative overflow-hidden transition-all duration-300 ${isSelected ? 'border-gh-blue ring-1 ring-gh-blue' : 'hover:border-gh-muted'}`}>
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gh-muted hover:text-white">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => onCompareToggle(recommendation)}
            className="w-4 h-4 accent-gh-blue bg-gh-bg border-gh-border rounded"
          />
          Compare
        </label>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className={`p-2 rounded-md border transition-colors ${isSaved ? 'bg-gh-blue/20 border-gh-blue text-gh-blue' : 'bg-gh-bg border-gh-border text-gh-muted hover:text-white hover:border-gh-muted'}`}
          title="Save to Wishlist"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mb-4 pr-32">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-gh-border text-gh-text text-xs font-bold px-2 py-0.5 rounded-full">
            #{index + 1} Best
          </span>
          <span className="text-xs text-gh-muted flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {recommendation.year || '2024'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{recommendation.name}</h3>
        <p className="text-sm text-gh-blue font-medium flex items-center gap-1">
          <Tag className="w-3 h-3" /> {recommendation.brand}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <span className="bg-gh-green/10 text-gh-green px-3 py-1 rounded-lg text-sm font-semibold border border-gh-green/20">
          ₹ {recommendation.price_range}
        </span>
        <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg text-sm font-semibold border border-yellow-500/20 flex items-center gap-1">
          {'★'.repeat(recommendation.energy_rating || 5)}{'☆'.repeat(5 - (recommendation.energy_rating || 5))}
        </span>
        {recommendation.units_per_year && (
          <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg text-sm font-medium border border-purple-500/20 flex items-center gap-1">
            <Zap className="w-3 h-3" /> {recommendation.units_per_year} units/yr
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <h4 className="text-xs font-semibold text-gh-muted uppercase tracking-wider mb-2">Pros</h4>
          <ul className="space-y-1">
            {recommendation.pros.map((pro, i) => (
              <li key={i} className="text-sm text-white flex items-start gap-2">
                <Check className="w-4 h-4 text-gh-green shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gh-muted uppercase tracking-wider mb-2">Cons</h4>
          <ul className="space-y-1">
            {recommendation.cons.map((con, i) => (
              <li key={i} className="text-sm text-white flex items-start gap-2">
                <X className="w-4 h-4 text-gh-red shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#1c2128] border border-gh-border rounded-lg p-4">
        <h4 className="text-xs font-bold text-gh-blue uppercase tracking-wider mb-2 flex items-center gap-1">
          <Info className="w-3 h-3" /> AI Reasoning
        </h4>
        <p className="text-sm text-gh-text leading-relaxed">
          {recommendation.why_recommended}
        </p>
      </div>
    </div>
  );
}
