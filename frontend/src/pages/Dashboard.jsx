import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartForm from '../components/SmartForm';
import RecommendationCard from '../components/RecommendationCard';
import { getRecommendations, saveHistory, getHistory, chatWithAi } from '../api';
import { Search, IndianRupee, Bookmark, Target, Sparkles, Activity } from 'lucide-react';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ searches: 0, savings: 0, bookmarks: 0, accuracy: 94 });
  const [insight, setInsight] = useState("Loading personalized insight...");
  const [recent, setRecent] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    getHistory().then(history => {
      setStats(prev => ({ ...prev, searches: history.length, bookmarks: 0 }));
      setRecent(history.slice(0, 3));
      
      if (history.length > 0) {
        const last = history[0];
        chatWithAi([{ role: 'user', content: `Give me a 1 sentence energy saving tip for a ${last.category} in a ${last.city || 'general'} climate.` }])
          .then(res => setInsight(res.content))
          .catch(() => setInsight("Tip: Always look for appliances with inverter technology to save up to 30% on electricity bills."));
      } else {
        setInsight("Welcome! Start searching to get personalized energy-saving insights.");
      }
    }).catch(console.error);
  }, []);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    setSelectedForCompare([]);

    try {
      const response = await getRecommendations(formData);
      if (response && response.recommendations) {
        setRecommendations(response.recommendations);
        await saveHistory({ ...formData, recommendations: response.recommendations });
      } else {
        setError("Invalid response from AI.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompare = (rec) => {
    setSelectedForCompare(prev => {
      const exists = prev.find(p => p.name === rec.name);
      if (exists) return prev.filter(p => p.name !== rec.name);
      if (prev.length >= 3) return prev;
      return [...prev, rec];
    });
  };

  const handleCompareClick = () => {
    navigate('/compare', { state: { selectedItems: selectedForCompare } });
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0 space-y-6">
      
      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="gh-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(56,139,253,0.1)' }}>
            <Search className="w-6 h-6" style={{ color: '#388bfd' }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase" style={{ color: '#8b949e' }}>Total Searches</p>
            <p className="text-2xl font-bold text-white">{stats.searches}</p>
          </div>
        </div>
        <div className="gh-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(63,185,80,0.1)' }}>
            <IndianRupee className="w-6 h-6" style={{ color: '#3fb950' }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase" style={{ color: '#8b949e' }}>Est. Savings</p>
            <p className="text-2xl font-bold text-white">₹{stats.searches * 1500}</p>
          </div>
        </div>
        <div className="gh-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(248,81,73,0.1)' }}>
            <Bookmark className="w-6 h-6" style={{ color: '#f85149' }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase" style={{ color: '#8b949e' }}>Bookmarked</p>
            <p className="text-2xl font-bold text-white">{stats.bookmarks}</p>
          </div>
        </div>
        <div className="gh-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(168,85,247,0.1)' }}>
            <Target className="w-6 h-6" style={{ color: '#c084fc' }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase" style={{ color: '#8b949e' }}>AI Accuracy</p>
            <p className="text-2xl font-bold text-white">{stats.accuracy}%</p>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="gh-card p-4 flex items-center gap-4" style={{ backgroundColor: 'rgba(56,139,253,0.05)', borderColor: 'rgba(56,139,253,0.5)' }}>
        <Sparkles className="w-6 h-6 shrink-0" style={{ color: '#388bfd' }} />
        <div>
          <h4 className="text-sm font-bold text-white">Personalized AI Insight</h4>
          <p className="text-sm" style={{ color: '#c9d1d9' }}>{insight}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <SmartForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          {error && (
            <div className="p-4 rounded-lg text-sm border" style={{ backgroundColor: 'rgba(248,81,73,0.1)', borderColor: '#f85149', color: '#f85149' }}>
              {error}
            </div>
          )}
          
          {/* Recent Activity */}
          <div className="gh-card p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" style={{ color: '#8b949e' }} /> Recent Activity
            </h3>
            <div className="space-y-4">
              {recent.length === 0 ? (
                <p className="text-sm" style={{ color: '#8b949e' }}>No recent activity.</p>
              ) : (
                recent.map(r => (
                  <div key={r.id} className="flex justify-between items-center pb-3 last:border-0 last:pb-0" style={{ borderBottom: '1px solid #21262d' }}>
                    <div>
                      <p className="text-sm font-semibold text-white">{r.category}</p>
                      <p className="text-xs" style={{ color: '#8b949e' }}>{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}>Viewed</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {!isLoading && recommendations.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Top Recommendations</h2>
                {selectedForCompare.length > 0 && (
                  <button onClick={handleCompareClick} className="gh-btn-primary">
                    Compare Selected ({selectedForCompare.length})
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec, i) => (
                  <RecommendationCard 
                    key={i} recommendation={rec} index={i} 
                    onCompareToggle={toggleCompare} 
                    isSelected={selectedForCompare.some(p => p.name === rec.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {!isLoading && recommendations.length === 0 && !error && (
            <div className="gh-card h-64 flex flex-col items-center justify-center text-center p-8" style={{ borderStyle: 'dashed' }}>
              <Sparkles className="w-12 h-12 mb-4" style={{ color: '#21262d' }} />
              <h3 className="text-xl font-semibold text-white mb-2">Ready for Analysis</h3>
              <p className="max-w-md" style={{ color: '#8b949e' }}>Configure your requirements on the left to generate personalized AI recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
