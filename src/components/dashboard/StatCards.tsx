import React from 'react';
import { GraduationCap, Building2, Check, Hourglass, Globe, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StatCards: React.FC = () => {
  const {
    submittedCount,
    totalSchools,
    offersCount,
    inProgressCount,
    countriesCount,
    setActiveTab,
  } = useApp();

  const cards = [
    {
      id: 'submitted',
      icon: <GraduationCap className="w-5 h-5 text-purple-300" />,
      iconBg: 'bg-purple-500/20 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.35)]',
      value: submittedCount,
      label: 'Applications Submitted',
      sub: totalSchools > 0 ? `${Math.round((submittedCount / totalSchools) * 100)}% of total` : 'Ready to apply',
      subColor: 'text-emerald-400',
      bgGrad: 'from-[#171030] to-[#0d091e]',
      border: 'border-purple-500/25 hover:border-purple-500/50',
      glow: 'shadow-[0_4px_25px_rgba(147,51,234,0.15)]',
      onClick: () => setActiveTab('applications'),
    },
    {
      id: 'shortlisted',
      icon: <Building2 className="w-5 h-5 text-blue-300" />,
      iconBg: 'bg-blue-500/20 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.35)]',
      value: totalSchools,
      label: 'Universities Shortlisted',
      sub: totalSchools > 0 ? `${countriesCount} countries` : 'Start your list',
      subColor: 'text-cyan-400',
      bgGrad: 'from-[#0b1b36] to-[#070f20]',
      border: 'border-blue-500/25 hover:border-blue-500/50',
      glow: 'shadow-[0_4px_25px_rgba(59,130,246,0.15)]',
      onClick: () => setActiveTab('universities'),
    },
    {
      id: 'offers',
      icon: <Check className="w-5 h-5 text-emerald-300 stroke-[3]" />,
      iconBg: 'bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
      value: offersCount,
      label: 'Offers Received',
      sub: offersCount > 0 ? 'Congratulations!' : 'Awaiting decisions',
      subColor: 'text-emerald-400',
      bgGrad: 'from-[#09221d] to-[#051411]',
      border: 'border-emerald-500/25 hover:border-emerald-500/50',
      glow: 'shadow-[0_4px_25px_rgba(16,185,129,0.15)]',
      onClick: () => setActiveTab('scholarships'),
    },
    {
      id: 'inprogress',
      icon: <Hourglass className="w-5 h-5 text-amber-300" />,
      iconBg: 'bg-amber-500/20 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
      value: inProgressCount,
      label: 'Applications In Progress',
      sub: inProgressCount > 0 ? '→ Track them' : 'Drafting materials',
      subColor: 'text-amber-400 hover:text-amber-300',
      bgGrad: 'from-[#251a0b] to-[#140e06]',
      border: 'border-amber-500/25 hover:border-amber-500/50',
      glow: 'shadow-[0_4px_25px_rgba(245,158,11,0.15)]',
      onClick: () => setActiveTab('applications'),
    },
    {
      id: 'countries',
      icon: <Globe className="w-5 h-5 text-pink-300" />,
      iconBg: 'bg-pink-500/20 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.35)]',
      value: countriesCount,
      label: 'Countries Exploring',
      sub: countriesCount > 0 ? '→ View list' : 'Worldwide options',
      subColor: 'text-pink-400 hover:text-pink-300',
      bgGrad: 'from-[#280c2e] to-[#16061a]',
      border: 'border-pink-500/25 hover:border-pink-500/50',
      glow: 'shadow-[0_4px_25px_rgba(236,72,153,0.15)]',
      onClick: () => setActiveTab('applications'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={card.onClick}
          className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-b ${card.bgGrad} p-4 sm:p-5 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl ${card.glow} cursor-pointer group flex flex-col justify-between`}
        >
          {/* Subtle light reflection on card top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Icon Circle */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg} transition-transform group-hover:scale-110`}>
              {card.icon}
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Number & Labels */}
          <div>
            <div className="text-3xl font-black text-white tracking-tight mb-1 tabular-nums">
              {card.value}
            </div>
            <div className="text-xs font-semibold text-slate-300 leading-tight mb-2">
              {card.label}
            </div>
            <div className={`text-[11px] font-bold ${card.subColor} flex items-center gap-1`}>
              <span>{card.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
