import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { getCountryFlag, formatDate } from '../utils/formatters';
import { School } from '../types';
import { SchoolDetailModal } from '../components/schools/SchoolDetailModal';

export const TimelineView: React.FC = () => {
  const { schools } = useApp();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>('all');

  // Sort schools by deadline
  const sortedSchools = useMemo(() => {
    return [...schools]
      .filter(s => Boolean(s.deadline))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [schools]);

  // Group by Month Year
  const groupedByMonth = useMemo(() => {
    const map: Record<string, School[]> = {};
    sortedSchools.forEach(school => {
      const d = new Date(school.deadline);
      const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!map[key]) map[key] = [];
      map[key].push(school);
    });
    return map;
  }, [sortedSchools]);

  const monthKeys = Object.keys(groupedByMonth);

  const displayedMonths = useMemo(() => {
    if (filterMonth === 'all') return monthKeys;
    return monthKeys.filter(m => m === filterMonth);
  }, [monthKeys, filterMonth]);

  const getUrgency = (deadlineStr: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const d = new Date(deadlineStr);
    d.setHours(0, 0, 0, 0);
    const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);

    if (diff < 0) return { label: 'Overdue', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    if (diff === 0) return { label: 'Due Today', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse' };
    if (diff <= 7) return { label: `${diff}d left`, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    if (diff <= 14) return { label: `${diff}d left`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (diff <= 30) return { label: `${diff}d left`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: `${diff}d left`, color: 'text-slate-400 bg-white/[0.04] border-white/10' };
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7 max-w-[1700px] mx-auto w-full relative z-10">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              <h1 className="text-2xl font-black text-white tracking-tight">Application Timeline</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Chronological schedule of your admissions deadlines. Stay ahead of every submission cutoff.
            </p>
          </div>

          {monthKeys.length > 1 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-[#0a1224] border border-white/10 rounded-2xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50"
              >
                <option className="bg-[#0a1224] text-slate-100 py-1" value="all">All Months</option>
                {monthKeys.map(m => (
                  <option className="bg-[#0a1224] text-slate-100 py-1" key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Timeline Stream */}
      {sortedSchools.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border border-white/[0.08] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Deadlines Tracked</h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Add universities with their target deadlines on the Applications or Dashboard page to see your chronological roadmap here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {displayedMonths.map((monthKey) => {
            const monthSchools = groupedByMonth[monthKey] || [];
            return (
              <div key={monthKey} className="flex flex-col gap-4">
                {/* Month Group Header */}
                <div className="flex items-center gap-3">
                  <div className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-extrabold text-xs shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    {monthKey}
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-400/30 via-white/[0.06] to-transparent" />
                  <span className="text-[11px] text-slate-500 font-medium">
                    {monthSchools.length} {monthSchools.length === 1 ? 'Deadline' : 'Deadlines'}
                  </span>
                </div>

                {/* Timeline Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monthSchools.map((school) => {
                    const urgency = getUrgency(school.deadline);
                    return (
                      <div
                        key={school.id}
                        onClick={() => setSelectedSchool(school)}
                        className="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-amber-400/40 hover:bg-white/[0.04] transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
                      >
                        <div>
                          {/* Top row: Date & Urgency badge */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span>{formatDate(school.deadline)}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${urgency.color}`}>
                              {urgency.label}
                            </span>
                          </div>

                          {/* University Name & Program */}
                          <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
                            {school.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                            <span className="text-base">{getCountryFlag(school.countryCode)}</span>
                            <span>{school.country}</span>
                            <span className="text-slate-600">·</span>
                            <span className="truncate">{school.program}</span>
                          </div>
                        </div>

                        {/* Bottom row: Status & View indicator */}
                        <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                          <StatusBadge status={school.status} />
                          <span className="text-[11px] text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                            View Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* School Detail Modal */}
      <SchoolDetailModal
        isOpen={selectedSchool !== null}
        onClose={() => setSelectedSchool(null)}
        school={selectedSchool}
      />
    </div>
  );
};

export default TimelineView;
