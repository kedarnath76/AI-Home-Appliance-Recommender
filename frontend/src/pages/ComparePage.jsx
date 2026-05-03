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
        <p className="mb-4" style={{ color: '#8b949e' }}>Please select appliances from the dashboard first.</p>
        <Link to="/" className="gh-btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  // Find the lowest price item
  const lowestPriceIndex = items.reduce((minIndex, item, currentIndex, arr) => {
    const priceA = typeof arr[minIndex].price === 'number' ? arr[minIndex].price : parseInt(String(arr[minIndex].price).replace(/\D/g, '')) || 999999;
    const priceB = typeof item.price === 'number' ? item.price : parseInt(String(item.price).replace(/\D/g, '')) || 999999;
    return priceB < priceA ? currentIndex : minIndex;
  }, 0);

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 transition-colors hover:text-white" style={{ color: '#8b949e' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Compare Appliances</h1>
        <p style={{ color: '#8b949e' }}>Detailed side-by-side comparison of your selections.</p>
      </header>

      <div className="gh-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr style={{ backgroundColor: '#1c2128' }}>
              <th className="p-4 font-semibold w-1/4 border-b" style={{ color: '#8b949e', borderColor: '#21262d' }}>Feature</th>
              {items.map((item, i) => (
                <th key={i} className="p-4 font-bold text-white border-b w-1/4" style={{ borderColor: '#21262d' }}>
                  {item.name}
                  {i === lowestPriceIndex && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider" 
                          style={{ backgroundColor: 'rgba(63,185,80,0.2)', color: '#3fb950' }}>
                      Best Value
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y text-sm" style={{ borderColor: '#21262d' }}>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium" style={{ color: '#8b949e' }}>Brand</td>
              {items.map((item, i) => <td key={i} className="p-4 text-white font-semibold">{item.brand}</td>)}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium" style={{ color: '#8b949e' }}>Price</td>
              {items.map((item, i) => (
                <td key={i} className="p-4 font-bold" style={{ color: i === lowestPriceIndex ? '#3fb950' : '#fff' }}>
                  ₹{item.price.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium" style={{ color: '#8b949e' }}>Energy Rating</td>
              {items.map((item, i) => <td key={i} className="p-4 text-yellow-500">{item.energy_rating}</td>)}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium" style={{ color: '#8b949e' }}>AI Reasoning</td>
              {items.map((item, i) => (
                <td key={i} className="p-4 align-top text-xs leading-relaxed" style={{ color: '#c9d1d9' }}>
                  {item.reason}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium align-top" style={{ color: '#8b949e' }}>Pros</td>
              {items.map((item, i) => (
                <td key={i} className="p-4 text-white align-top">
                  <ul className="space-y-1">
                    {item.pros.map((p, j) => (
                      <li key={j} className="flex gap-2">
                        <Check className="w-4 h-4 shrink-0" style={{ color: '#3fb950' }} /> 
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium align-top" style={{ color: '#8b949e' }}>Cons</td>
              {items.map((item, i) => (
                <td key={i} className="p-4 text-white align-top">
                  <ul className="space-y-1">
                    {item.cons.map((c, j) => (
                      <li key={j} className="flex gap-2">
                        <X className="w-4 h-4 shrink-0" style={{ color: '#f85149' }} /> 
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
