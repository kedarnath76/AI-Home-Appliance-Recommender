import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';

export default function ComparePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.selectedItems || [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Nothing to compare</h2>
        <p className="text-gh-muted mb-4">Please select appliances from the dashboard first.</p>
        <Link to="/" className="gh-btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  // Find the lowest price item (best value simplistic metric)
  const lowestPriceIndex = items.reduce((minIndex, item, currentIndex, arr) => {
    // very rough string extract for demonstration since price is a string range
    const priceA = parseInt(arr[minIndex].price_range.replace(/\D/g, '')) || 999999;
    const priceB = parseInt(item.price_range.replace(/\D/g, '')) || 999999;
    return priceB < priceA ? currentIndex : minIndex;
  }, 0);

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gh-muted hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Compare Appliances</h1>
        <p className="text-gh-muted">Detailed side-by-side comparison of your selections.</p>
      </header>

      <div className="gh-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#1c2128]">
              <th className="p-4 font-semibold text-gh-muted w-1/4 border-b border-gh-border">Feature</th>
              {items.map((item, i) => (
                <th key={i} className="p-4 font-bold text-white border-b border-gh-border w-1/4">
                  {item.name}
                  {i === lowestPriceIndex && <span className="ml-2 bg-gh-green/20 text-gh-green text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Best Value</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gh-border text-sm">
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-gh-muted">Brand</td>
              {items.map((item, i) => <td key={i} className="p-4 text-white font-semibold">{item.brand}</td>)}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-gh-muted">Price Range</td>
              {items.map((item, i) => <td key={i} className={`p-4 font-bold ${i === lowestPriceIndex ? 'text-gh-green' : 'text-white'}`}>₹ {item.price_range}</td>)}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-gh-muted">Energy Rating</td>
              {items.map((item, i) => <td key={i} className="p-4 text-yellow-500">{'★'.repeat(item.energy_rating || 5)}</td>)}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-gh-muted">Consumption</td>
              {items.map((item, i) => <td key={i} className="p-4 text-white">{item.units_per_year} units/yr</td>)}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-gh-muted align-top">Pros</td>
              {items.map((item, i) => (
                <td key={i} className="p-4 text-white align-top">
                  <ul className="space-y-1">
                    {item.pros.map((p, j) => <li key={j} className="flex gap-2"><Check className="w-4 h-4 text-gh-green shrink-0" /> <span>{p}</span></li>)}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-gh-muted align-top">Cons</td>
              {items.map((item, i) => (
                <td key={i} className="p-4 text-white align-top">
                  <ul className="space-y-1">
                    {item.cons.map((c, j) => <li key={j} className="flex gap-2"><X className="w-4 h-4 text-gh-red shrink-0" /> <span>{c}</span></li>)}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium text-gh-muted align-top">AI Reasoning</td>
              {items.map((item, i) => <td key={i} className="p-4 text-gh-muted align-top text-xs leading-relaxed">{item.why_recommended}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
