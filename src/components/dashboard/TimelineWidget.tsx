import React from 'react';
import { Building2, Search, FileText, Send, Hourglass, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TimelineWidget: React.FC = () => {
  const { setActiveTab, schools, requirements, submittedCount, offersCount } = useApp();

  const hasSchools = schools.length > 0;
  const hasReqs = requirements.some(r => r.status !== 'Not Started');
  const hasSubmissions = submittedCount > 0;
  const hasReview = schools.some(s => s.status === 'Interview' || s.status === 'In Progress');
  const hasOffers = offersCount > 0;

  const timelineMilestones = [
    {
      id: '1',
      date: hasSchools ? 'Research Phase' : 'Step 1',
      title: 'Research Started',
      icon: <Search className={`w-4 h-4 ${hasSchools ? 'text-emerald-300' : 'text-slate-500'}`} />,
      ring: hasSchools
        ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
        : 'border-white/10 bg-white/[0.02]',
      status: hasSchools ? 'completed' : 'pending',
    },
    {
      id: '2',
      date: hasReqs ? 'In Preparation' : 'Step 2',
      title: 'Documents Prepared',
      icon: <FileText className={`w-4 h-4 ${hasReqs ? 'text-emerald-300' : 'text-slate-500'}`} />,
      ring: hasReqs
        ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
        : 'border-white/10 bg-white/[0.02]',
      status: hasReqs ? 'completed' : 'pending',
    },
    {
      id: '3',
      date: hasSubmissions ? `${submittedCount} Submitted` : 'Step 3',
      title: 'Applications Submitted',
      icon: <Send className={`w-4 h-4 ${hasSubmissions ? 'text-amber-300' : 'text-slate-500'}`} />,
      ring: hasSubmissions
        ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
        : 'border-white/10 bg-white/[0.02]',
      status: hasSubmissions ? 'active' : 'pending',
    },
    {
      id: '4',
      date: hasReview ? 'Under Committee' : 'Step 4',
      title: 'Reviews In Progress',
      icon: <Hourglass className={`w-4 h-4 ${hasReview ? 'text-cyan-300' : 'text-slate-500'}`} />,
      ring: hasReview
        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
        : 'border-white/10 bg-white/[0.02]',
      status: hasReview ? 'active' : 'upcoming',
    },
    {
      id: '5',
      date: hasOffers ? `${offersCount} Received!` : 'Step 5',
      title: 'First Offer Expected',
      icon: <Trophy className={`w-4 h-4 ${hasOffers ? 'text-amber-300' : 'text-slate-500'}`} />,
      ring: hasOffers
        ? 'border-amber-400 bg-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
        : 'border-white/10 bg-white/[0.02]',
      status: hasOffers ? 'completed' : 'upcoming',
    },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">Application Timeline</h3>
        </div>
        <button
          onClick={() => setActiveTab('timeline')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View Full Timeline
        </button>
      </div>

      {/* Horizontal Flow Line & Milestones */}
      <div className="relative pt-2 pb-2">
        {/* Connecting Flow Line */}
        <div className="absolute top-[27px] left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-400 via-yellow-400 via-amber-400 to-slate-700 opacity-60 hidden sm:block shadow-[0_0_10px_rgba(245,158,11,0.3)]" />

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
          {timelineMilestones.map((node) => (
            <div key={node.id} className="flex flex-col items-center text-center group cursor-pointer">
              {/* Circular Icon Node */}
              <div
                className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${node.ring} bg-[#0a1224] mb-3 group-hover:scale-110`}
              >
                {node.icon}
              </div>

              {/* Date / Status Tag */}
              <div className="text-[11px] font-medium text-slate-400 mb-0.5 tracking-tight">
                {node.date}
              </div>

              {/* Title */}
              <div className="text-xs font-bold text-white tracking-tight leading-tight">
                {node.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
