import React from 'react';
import {
  Home,
  FileText,
  Building2,
  GraduationCap,
  Trophy,
  Files,
  Calendar,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
  { id: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" /> },
  { id: 'universities', label: 'Universities', icon: <Building2 className="w-4 h-4" /> },
  { id: 'programs', label: 'Programs', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'scholarships', label: 'Scholarships', icon: <Trophy className="w-4 h-4" /> },
  { id: 'documents', label: 'Documents', icon: <Files className="w-4 h-4" /> },
  { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
  { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <aside className="w-60 shrink-0 flex flex-col h-full bg-[#070b18] border-r border-white/[0.07] select-none z-20">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-black text-white tracking-wide leading-none flex items-center">
              GradTrack
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium leading-none tracking-tight">
              Your Masters Application Journey
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-300 transition-colors'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400/80" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom "Turn Your Dream University Into a Plan" Card */}
      <div className="p-3.5 border-t border-white/[0.06]">
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-b from-[#121a2d] to-[#0d1424] border border-amber-400/30 shadow-[0_0_25px_rgba(245,158,11,0.15)] text-center flex flex-col items-center">
          {/* Subtle gold glow in background */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-2.5 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <GraduationCap className="w-7 h-7" />
          </div>

          <h4 className="text-xs font-bold text-white leading-tight mb-3 px-1">
            Turn Your Dream University Into a Plan
          </h4>

          <button
            onClick={() => setActiveTab('applications')}
            className="w-full py-2 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </aside>
  );
};
