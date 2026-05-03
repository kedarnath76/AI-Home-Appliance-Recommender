import React from 'react';
import { Calendar, Tag } from 'lucide-react';

export default function HistoryList({ history, onSelect }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 glassmorphism rounded-2xl">
        <p className="text-dark-muted">No history found. Try getting some recommendations first!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {history.map((item) => (
        <div 
          key={item.id} 
          onClick={() => onSelect(item)}
          className="glassmorphism rounded-2xl p-5 cursor-pointer hover:border-primary-500/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-2 py-1 rounded">
              {item.category}
            </span>
            <span className="text-xs text-dark-muted flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-sm text-white flex justify-between">
              <span className="text-dark-muted">Budget:</span>
              <span className="font-medium">₹{item.budget}</span>
            </p>
            <p className="text-sm text-white flex justify-between">
              <span className="text-dark-muted">Room:</span>
              <span className="font-medium">{item.room_size.split(' ')[0]}</span>
            </p>
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-dark-muted mb-2 font-medium">Top Pick:</p>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-semibold text-white truncate">
                {item.recommendations[0]?.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
