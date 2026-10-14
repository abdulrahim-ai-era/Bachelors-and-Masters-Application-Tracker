import React, { useState } from 'react';
import { Sparkles, Send, Search, FileText, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIAssistantWidget: React.FC = () => {
  const { settings } = useApp();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { text: 'Suggest universities for my profile', icon: <Search className="w-3.5 h-3.5 text-cyan-400" /> },
    { text: 'Review my application essay', icon: <FileText className="w-3.5 h-3.5 text-amber-400" /> },
    { text: 'Check visa and funding options', icon: <Globe className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `I'm analyzing your academic profile for ${settings.targetDegree || "Master's"} programs. You currently have strong matches in Stanford, MIT, Oxford, ETH Zurich, and Melbourne!`;
      if (userMsg.toLowerCase().includes('suggest') || userMsg.toLowerCase().includes('universit')) {
        reply = `Based on your profile, I recommend categorizing your applications:\n\n• Reach: Stanford (AI Track), MIT (Decision Making), CMU\n• Match: University of Oxford, ETH Zurich, University of Toronto\n• Safety: University of Melbourne (Offer Received!), TU Munich`;
      } else if (userMsg.toLowerCase().includes('essay') || userMsg.toLowerCase().includes('review') || userMsg.toLowerCase().includes('sop')) {
        reply = `Here are 3 key tips for your Statement of Purpose:\n1. Quantify your research results and publications\n2. Mention specific professors you want to work with\n3. Keep it within 2 pages with a strong opening paragraph`;
      } else if (userMsg.toLowerCase().includes('visa') || userMsg.toLowerCase().includes('fund')) {
        reply = `For ${settings.targetDegree || "Master's"} applicants:\n• US (F-1): Apply for I-20 as soon as offer is accepted\n• Full funding: Stanford GRA and MIT fellowships cover tuition + $34k stipend\n• Check your Funding tab for net cost comparisons!`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">AI Assistant</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold tracking-wider">
          Beta
        </span>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex flex-col justify-center my-1">
        {messages.length === 0 ? (
          <div className="space-y-3">
            {/* Robot Mascot & Greeting */}
            <div className="flex items-center gap-3.5">
              {/* 3D Glowing Robot Mascot SVG */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-md" />
                <svg viewBox="0 0 100 100" className="w-14 h-14 relative z-10 drop-shadow-[0_5px_15px_rgba(6,182,212,0.4)]">
                  <defs>
                    <linearGradient id="botBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e2e8f0" />
                      <stop offset="50%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <linearGradient id="botFaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#081024" />
                      <stop offset="100%" stopColor="#040714" />
                    </linearGradient>
                  </defs>
                  {/* Antennas / ears */}
                  <rect x="24" y="32" width="6" height="12" rx="3" fill="#64748b" />
                  <rect x="70" y="32" width="6" height="12" rx="3" fill="#64748b" />
                  {/* Head chassis */}
                  <rect x="28" y="20" width="44" height="38" rx="14" fill="url(#botBodyGrad)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Visor / screen face */}
                  <rect x="33" y="26" width="34" height="24" rx="8" fill="url(#botFaceGrad)" />
                  {/* Glowing cyan eyes */}
                  <circle cx="43" cy="38" r="4" fill="#38bdf8" className="animate-pulse" />
                  <circle cx="57" cy="38" r="4" fill="#38bdf8" className="animate-pulse" />
                  {/* Smile */}
                  <path d="M 46 44 Q 50 47 54 44" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Body chassis */}
                  <path d="M 34 60 L 66 60 L 72 85 L 28 85 Z" fill="url(#botBodyGrad)" />
                  {/* Chest emblem */}
                  <circle cx="50" cy="72" r="5" fill="#38bdf8" />
                </svg>
              </div>

              {/* Greeting Bubble */}
              <div>
                <div className="text-xs font-bold text-white leading-snug">
                  Hi {settings.applicantName || 'there'}!
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">
                  Need help with your {settings.targetDegree || "Masters"} journey?
                </div>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-1.5 pt-1">
              {quickPrompts.map((p) => (
                <button
                  key={p.text}
                  onClick={() => handleSend(p.text)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-cyan-500/40 text-left text-xs text-slate-300 hover:text-white transition-all duration-200 group"
                >
                  <span className="shrink-0">{p.icon}</span>
                  <span className="truncate group-hover:text-cyan-300 transition-colors font-medium text-[11px]">
                    {p.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 ml-6 text-right'
                    : 'bg-white/[0.04] border border-white/10 text-slate-200 mr-6 whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs py-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Pill */}
      <div className="mt-3 relative">
        <input
          type="text"
          placeholder="Ask anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
          className="w-full bg-[#0a1224] border border-white/10 focus:border-cyan-500/50 rounded-full pl-4 pr-11 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
        />
        <button
          onClick={() => handleSend(inputValue)}
          disabled={!inputValue.trim()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow-md"
        >
          <Send className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
