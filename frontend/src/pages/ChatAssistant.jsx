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
      // Send entire conversation history (excluding first greeting if needed, but safe to send)
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
          <Sparkles className="w-6 h-6 text-gh-blue" /> AI Advisor Chat
        </h1>
        <p className="text-gh-muted text-sm">Ask any question about home appliances, specs, or maintenance.</p>
      </header>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2 mb-4 shrink-0">
        {suggestedPrompts.map((prompt, i) => (
          <button 
            key={i} 
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs bg-[#1c2128] border border-gh-border text-gh-text hover:text-gh-blue hover:border-gh-blue px-3 py-1.5 rounded-full transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 gh-card overflow-y-auto p-4 md:p-6 space-y-6 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-gh-blue text-white' : 'bg-gh-border text-gh-blue'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-gh-blue text-white rounded-tr-sm' 
                : 'bg-[#1c2128] border border-gh-border text-gh-text rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 max-w-[80%]">
             <div className="w-8 h-8 rounded-full bg-gh-border text-gh-blue shrink-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#1c2128] border border-gh-border text-gh-text rounded-tl-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-gh-blue rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gh-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-gh-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
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
          className="w-full bg-[#1c2128] border border-gh-border rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-gh-blue transition-colors shadow-lg"
          disabled={loading}
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="absolute right-3 top-3 p-1.5 bg-gh-blue text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
