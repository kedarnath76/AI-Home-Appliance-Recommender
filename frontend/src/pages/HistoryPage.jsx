import React, { useState, useEffect } from 'react';
import HistoryList from '../components/HistoryList';
import RecommendationCard from '../components/RecommendationCard';
import ComparisonTable from '../components/ComparisonTable';
import { getHistory } from '../api';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (selectedItem) {
    return (
      <div className="animate-fade-in pb-20 md:pb-0">
        <button 
          onClick={() => setSelectedItem(null)}
          className="mb-6 flex items-center gap-2 text-dark-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </button>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            {selectedItem.category} Recommendations
            <span className="text-sm font-normal bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full">
              ₹{selectedItem.budget}
            </span>
          </h1>
          <p className="text-dark-muted">
            Saved on {new Date(selectedItem.created_at).toLocaleDateString()}
          </p>
        </header>

        <div className="space-y-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedItem.recommendations.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} index={i} />
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Comparison</h2>
            <ComparisonTable recommendations={selectedItem.recommendations} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your History</h1>
        <p className="text-dark-muted text-lg">Past recommendations saved for you.</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
          {error}
        </div>
      ) : (
        <HistoryList history={history} onSelect={setSelectedItem} />
      )}
    </div>
  );
}
