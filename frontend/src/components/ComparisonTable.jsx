import React from 'react';

export default function ComparisonTable({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glassmorphism rounded-2xl overflow-x-auto mt-8">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="p-4 font-semibold text-white">Feature</th>
            {recommendations.map((rec, i) => (
              <th key={i} className="p-4 font-semibold text-primary-400 min-w-[200px]">
                {rec.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-sm">
          <tr className="hover:bg-white/5 transition-colors">
            <td className="p-4 font-medium text-dark-muted">Brand</td>
            {recommendations.map((rec, i) => (
              <td key={i} className="p-4 text-white">{rec.brand}</td>
            ))}
          </tr>
          <tr className="hover:bg-white/5 transition-colors">
            <td className="p-4 font-medium text-dark-muted">Price Range</td>
            {recommendations.map((rec, i) => (
              <td key={i} className="p-4 text-emerald-400">{rec.price_range}</td>
            ))}
          </tr>
          <tr className="hover:bg-white/5 transition-colors">
            <td className="p-4 font-medium text-dark-muted">Energy Rating</td>
            {recommendations.map((rec, i) => (
              <td key={i} className="p-4 text-amber-400">{rec.energy_rating}</td>
            ))}
          </tr>
          <tr className="hover:bg-white/5 transition-colors">
            <td className="p-4 font-medium text-dark-muted">Key Pro</td>
            {recommendations.map((rec, i) => (
              <td key={i} className="p-4 text-white/90">{rec.pros[0]}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
