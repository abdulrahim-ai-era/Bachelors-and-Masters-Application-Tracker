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
  X,
  ShieldCheck,
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

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const { activeTab, setActiveTab } = useApp();

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070b18] select-none">
      {/* Brand Header */}
      <div className="px-5 py-4 sm:py-5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] shrink-0">
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-black text-white tracking-wide leading-none flex items-center">
              GradTrack
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium leading-none tracking-tight">
              Application Journey
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
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

      {/* Bottom CTA Card */}
      <div className="p-3.5 border-t border-white/[0.06] space-y-3">
        <div className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-b from-[#121a2d] to-[#0d1424] border border-amber-400/30 shadow-[0_0_25px_rgba(245,158,11,0.15)] text-center flex flex-col items-center">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-2 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <GraduationCap className="w-5 h-5" />
          </div>

          <h4 className="text-[11px] font-bold text-white leading-tight mb-2.5 px-1">
            Turn Your Dream University Into a Plan
          </h4>

          <button
            onClick={() => handleNavClick('applications')}
            className="w-full py-1.5 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Ownership & Copyright Watermark */}
        <div className="px-1 text-center">
          <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400/80 shrink-0" />
            <span>Created by <strong className="text-slate-300">Abdul Rahim</strong></span>
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">
            © 2024–2026 • Personal Use License
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible lg+) */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col h-full border-r border-white/[0.07] z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible when mobileOpen is true on < lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer container */}
          <aside className="relative w-72 max-w-[85vw] h-full shadow-2xl border-r border-white/10 z-10 animate-slide-in-left">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
