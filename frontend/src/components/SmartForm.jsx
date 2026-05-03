import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const categories = ['AC', 'Washing Machine', 'Refrigerator', 'Microwave', 'Geyser', 'TV'];
const roomSizes = ['Small (< 100 sq ft)', 'Medium (100 - 200 sq ft)', 'Large (> 200 sq ft)'];
const energyPrefs = ['3 Star', '4 Star', '5 Star', 'Any'];
const usagePatterns = ['Light (1-2 hrs/day)', 'Moderate (4-6 hrs/day)', 'Heavy (> 8 hrs/day)'];

export default function SmartForm({ onSubmit, isLoading, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    category: 'AC',
    budget: 35000,
    room_size: roomSizes[0],
    energy_pref: '5 Star',
    brand_pref: '',
    usage_pattern: usagePatterns[1],
    city: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, budget: parseInt(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="gh-card p-6 md:p-8">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-gh-blue" /> Tell us what you need
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gh-muted uppercase tracking-wider">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="gh-input w-full">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gh-muted uppercase tracking-wider flex justify-between">
              <span>Budget</span>
              <span className="text-gh-blue font-bold">₹{formData.budget.toLocaleString()}</span>
            </label>
            <input 
              type="range" min="1000" max="100000" step="1000" 
              name="budget" value={formData.budget} onChange={handleSliderChange}
              className="w-full accent-gh-blue h-2 bg-gh-border rounded-lg appearance-none cursor-pointer"
            />
            <input 
              type="number" min="1000" max="100000" 
              name="budget" value={formData.budget} onChange={handleChange}
              className="gh-input w-full mt-2" placeholder="Exact budget..."
            />
          </div>

          {/* Room Size */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gh-muted uppercase tracking-wider">Room Size</label>
            <select name="room_size" value={formData.room_size} onChange={handleChange} className="gh-input w-full">
              {roomSizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Usage Pattern */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gh-muted uppercase tracking-wider">Usage Pattern</label>
            <select name="usage_pattern" value={formData.usage_pattern} onChange={handleChange} className="gh-input w-full">
              {usagePatterns.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Energy Rating */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gh-muted uppercase tracking-wider">Energy Preference</label>
            <select name="energy_pref" value={formData.energy_pref} onChange={handleChange} className="gh-input w-full">
              {energyPrefs.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* City / State */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gh-muted uppercase tracking-wider">City/Climate</label>
            <input 
              type="text" name="city" placeholder="e.g. Mumbai (Humid)"
              value={formData.city} onChange={handleChange}
              className="gh-input w-full"
            />
          </div>

          {/* Brand Preference */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-gh-muted uppercase tracking-wider">Preferred Brand (Optional)</label>
            <input 
              type="text" name="brand_pref" placeholder="e.g. Samsung, LG"
              value={formData.brand_pref} onChange={handleChange}
              className="gh-input w-full"
            />
          </div>
        </div>

        <button 
          type="submit" disabled={isLoading}
          className="gh-btn-primary w-full py-3 mt-4 text-base"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
              <Sparkles className="w-4 h-4 text-blue-300 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
              <Sparkles className="w-6 h-6 text-pink-300 animate-spin" style={{ animationDuration: '2.5s' }} />
              <span>AI is thinking...</span>
            </div>
          ) : (
            <>
              <span>Get Recommendations</span>
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
