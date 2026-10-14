import React from 'react';
import { Building2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProgressRadial: React.FC = () => {
  const { overallCompletionPercentage, totalSchools, statusCounts, offersCount } = useApp();

  const pct = overallCompletionPercentage || 0;

  // Calculate dynamic percentages based on actual applications
  const researchPct = totalSchools > 0 ? Math.round(((statusCounts['Researching'] + statusCounts['In Progress']) / totalSchools) * 100) : 0;
  const prepPct = totalSchools > 0 ? Math.round(((totalSchools - statusCounts['Researching']) / totalSchools) * 100) : 0;
  const appPct = totalSchools > 0 ? Math.round(((statusCounts['Submitted'] + statusCounts['Interview'] + statusCounts['Accepted']) / totalSchools) * 100) : 0;
  const trackPct = totalSchools > 0 ? Math.round(((statusCounts['Interview'] + statusCounts['Accepted']) / totalSchools) * 100) : 0;
  const admitPct = totalSchools > 0 ? Math.round((offersCount / totalSchools) * 100) : 0;

  const stages = [
    { label: 'Research', value: `${researchPct}%`, isCheck: researchPct >= 100, color: 'text-emerald-400', iconColor: 'text-emerald-400' },
    { label: 'Preparation', value: `${prepPct}%`, isCheck: prepPct >= 80, color: 'text-emerald-400', iconColor: 'text-emerald-400' },
    { label: 'Applications', value: `${appPct}%`, isCheck: false, color: 'text-amber-400', iconColor: 'border-amber-400' },
    { label: 'Tracking', value: `${trackPct}%`, isCheck: false, color: 'text-cyan-400', iconColor: 'border-cyan-400' },
    { label: 'Admitted', value: `${admitPct}%`, isCheck: false, color: 'text-slate-500', iconColor: 'border-slate-600' },
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Building2 className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-white tracking-wide">Application Progress</h3>
      </div>

      {/* Body: Donut Gauge + Stage Breakdown */}
      <div className="flex items-center justify-between gap-4">
        {/* Radial SVG Gauge */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="10"
            />
            {/* Multi-color Gradient Progress Arc */}
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="url(#progressDonutGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - (pct / 100))}
              className="drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="progressDonutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-white tracking-tight leading-none tabular-nums">{pct}%</span>
            <span className="text-[9px] text-slate-400 font-medium mt-1 leading-tight">
              Overall<br />Journey
            </span>
          </div>
        </div>

        {/* Stage List */}
        <div className="flex-1 space-y-2">
          {stages.map((stage) => (
            <div key={stage.label} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="text-slate-300 text-xs font-medium">{stage.label}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-bold ${stage.color}`}>
                {stage.isCheck ? (
                  <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
                ) : (
                  <span className={`w-2.5 h-2.5 rounded-full border ${stage.iconColor}`} />
                )}
                <span className="tabular-nums text-xs">{stage.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
