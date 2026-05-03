import React, { useState, useRef, useEffect } from 'react';
import { chatWithAi } from '../api';
import { Sparkles, Send, User } from 'lucide-react';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Appliance Advisor. What can I help you find today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const suggestedPrompts = [
    "Which AC is best for humid weather?",
    "Compare inverter vs non-inverter refrigerators",
    "Best appliance brands in India 2025"
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].filter(m => m.role === 'user' || m.role === 'assistant');
      const response = await chatWithAi(chatHistory);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto animate-fade-in">
      <header className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6" style={{ color: '#388bfd' }} /> AI Advisor Chat
        </h1>
        <p className="text-sm" style={{ color: '#8b949e' }}>Ask any question about home appliances, specs, or maintenance.</p>
      </header>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2 mb-4 shrink-0">
        {suggestedPrompts.map((prompt, i) => (
          <button 
            key={i} 
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs border px-3 py-1.5 rounded-full transition-colors hover:text-blue-400 hover:border-blue-400"
            style={{ backgroundColor: '#1c2128', borderColor: '#21262d', color: '#c9d1d9' }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 gh-card overflow-y-auto p-4 md:p-6 space-y-6 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border`} 
                 style={{ 
                   backgroundColor: msg.role === 'user' ? '#388bfd' : 'transparent', 
                   color: msg.role === 'user' ? '#fff' : '#388bfd',
                   borderColor: msg.role === 'user' ? '#388bfd' : '#21262d'
                 }}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'rounded-tr-sm' 
                : 'border rounded-tl-sm'
            }`}
            style={{
              backgroundColor: msg.role === 'user' ? '#388bfd' : '#1c2128',
              color: msg.role === 'user' ? '#fff' : '#c9d1d9',
              borderColor: msg.role === 'user' ? '#388bfd' : '#21262d'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 max-w-[80%]">
             <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border"
                  style={{ backgroundColor: 'transparent', color: '#388bfd', borderColor: '#21262d' }}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl border rounded-tl-sm flex gap-1 items-center"
                 style={{ backgroundColor: '#1c2128', borderColor: '#21262d' }}>
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#388bfd' }}></span>
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#388bfd', animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#388bfd', animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="shrink-0 relative">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="w-full border rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none transition-colors shadow-lg"
          style={{ backgroundColor: '#1c2128', borderColor: '#21262d' }}
          onFocus={e => e.currentTarget.style.borderColor = '#388bfd'}
          onBlur={e => e.currentTarget.style.borderColor = '#21262d'}
          disabled={loading}
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="absolute right-3 top-3 p-1.5 text-white rounded-lg disabled:opacity-50 transition-colors"
          style={{ backgroundColor: '#388bfd' }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#388bfd'}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
