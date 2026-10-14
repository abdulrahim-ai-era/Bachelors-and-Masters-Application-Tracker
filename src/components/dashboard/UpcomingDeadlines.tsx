import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const UpcomingDeadlines: React.FC = () => {
  const { upcomingDeadlines, setActiveTab } = useApp();

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">Upcoming Deadlines</h3>
        </div>
        <button
          onClick={() => setActiveTab('applications')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Deadlines List or Empty State */}
      {upcomingDeadlines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Calendar className="w-7 h-7 text-slate-600 mb-2" />
          <p className="text-xs text-slate-400 font-medium">No deadlines scheduled</p>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Add universities to see your calendar deadlines here.</p>
          <button
            onClick={() => setActiveTab('applications')}
            className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add University</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {upcomingDeadlines.slice(0, 4).map(({ school, isUrgent, isOverdue }) => (
            <div
              key={school.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium w-24 shrink-0 tabular-nums ${isUrgent ? 'text-amber-400 font-bold' : isOverdue ? 'text-rose-400' : 'text-slate-400'}`}>
                  {formatDate(school.deadline)}
                </span>
                <span className="text-xs font-bold text-white truncate max-w-[130px] sm:max-w-[170px]">
                  {school.name}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-semibold whitespace-nowrap shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                Application Deadline
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
