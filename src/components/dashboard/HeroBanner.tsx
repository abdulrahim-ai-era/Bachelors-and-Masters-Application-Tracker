import React from 'react';
import { Search, FileText, Send, BarChart3, Trophy, GraduationCap, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const journeyNodes = [
  {
    id: 'research',
    label: 'Research',
    sub: 'Find Your Fit',
    icon: <Search className="w-4 h-4" />,
    color: 'emerald',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    ring: 'border-emerald-400 bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 'prepare',
    label: 'Prepare',
    sub: 'Build Your Profile',
    icon: <FileText className="w-4 h-4" />,
    color: 'yellow',
    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
    ring: 'border-yellow-400 bg-yellow-500/20 text-yellow-300',
  },
  {
    id: 'apply',
    label: 'Apply',
    sub: 'Submit with Confidence',
    icon: <Send className="w-4 h-4" />,
    color: 'cyan',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    ring: 'border-cyan-400 bg-cyan-500/20 text-cyan-300',
  },
  {
    id: 'track',
    label: 'Track',
    sub: 'Stay Updated',
    icon: <BarChart3 className="w-4 h-4" />,
    color: 'amber',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    ring: 'border-amber-400 bg-amber-500/20 text-amber-300',
  },
  {
    id: 'admitted',
    label: 'Get Admitted',
    sub: 'Begin Your Next Chapter',
    icon: <Trophy className="w-4 h-4" />,
    color: 'gold',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.6)]',
    ring: 'border-amber-400 bg-amber-500/25 text-amber-200',
  },
];

export const HeroBanner: React.FC = () => {
  const { settings, setActiveTab } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#081024] via-[#0c1630] to-[#070e20] p-6 lg:p-8 shadow-2xl">
      {/* Curved luminous energy lines across the hero */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
          <path
            d="M 0 180 C 250 80, 500 240, 800 120 C 900 80, 950 140, 1000 160"
            fill="none"
            stroke="url(#heroCyanGrad)"
            strokeWidth="2"
          />
          <path
            d="M 0 200 C 300 220, 600 100, 1000 180"
            fill="none"
            stroke="url(#heroGoldGrad)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="heroCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        {/* Left Headline & Journey Pathway */}
        <div className="flex-1 w-full">
          {/* Main Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {settings.applicantName ? `${settings.applicantName}'s` : 'Your'} {settings.targetDegree || "Masters"} Journey
            </h1>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-1 font-medium tracking-wide">
              <span>Plan</span>
              <span className="text-slate-600">•</span>
              <span>Track</span>
              <span className="text-slate-600">•</span>
              <span>Achieve</span>
            </div>

            {!settings.applicantName && (
              <button
                onClick={() => setActiveTab('settings')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mt-3 transition-colors cursor-pointer"
              >
                <span>👋 Welcome! Click here to set your name & intake season</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Connected Journey Milestones */}
          <div className="relative pt-2 pb-1">
            {/* Glowing neon connecting curve line */}
            <div className="absolute top-[26px] left-6 right-6 h-[2px] bg-gradient-to-r from-emerald-500 via-yellow-400 via-cyan-400 via-amber-400 to-amber-300 hidden sm:block opacity-70 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-1 relative z-10">
              {journeyNodes.map((node) => (
                <div key={node.id} className="flex flex-col items-center text-center group cursor-pointer">
                  {/* Glowing Node Circle */}
                  <div
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${node.ring} ${node.glow} group-hover:scale-110 mb-2.5 bg-[#0a1428]`}
                  >
                    {node.icon}
                  </div>
                  {/* Label */}
                  <div className="text-xs font-bold text-white tracking-tight">{node.label}</div>
                  {/* Subtext */}
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{node.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: 3D Graduation Cap and Quote Card */}
        <div className="flex items-center gap-4 shrink-0 self-center xl:self-auto">
          {/* Floating 3D Gold Graduation Cap SVG */}
          <div className="relative w-28 h-28 hidden lg:flex items-center justify-center">
            {/* Ambient golden halo */}
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
            <svg viewBox="0 0 160 140" className="w-28 h-28 drop-shadow-[0_15px_25px_rgba(245,158,11,0.35)]">
              {/* Cap base / mortarboard rhomboid */}
              <defs>
                <linearGradient id="capGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#eab308" />
                  <stop offset="80%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <linearGradient id="capShine" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Skull cap under mortarboard */}
              <path d="M 50 70 Q 80 115 110 70 Z" fill="#78350f" />
              {/* Mortarboard rhomboid top */}
              <polygon points="80,25 150,55 80,85 10,55" fill="url(#capGoldGrad)" stroke="#fef08a" strokeWidth="1.5" />
              <polygon points="80,25 150,55 80,85 10,55" fill="url(#capShine)" />
              {/* Button button on top */}
              <circle cx="80" cy="55" r="4.5" fill="#fef08a" />
              {/* Tassel cord */}
              <path d="M 80 55 C 95 65, 115 75, 120 90" fill="none" stroke="#fef08a" strokeWidth="2.5" />
              {/* Tassel fringe */}
              <polygon points="116,90 124,90 126,115 114,115" fill="url(#capGoldGrad)" />
            </svg>
          </div>

          {/* Quote Card */}
          <div className="relative overflow-hidden rounded-2xl p-4 w-52 bg-gradient-to-br from-[#131b2e]/90 to-[#0c1424]/90 border border-amber-400/25 shadow-xl">
            <div className="w-7 h-7 rounded-lg bg-amber-400/15 flex items-center justify-center mb-2.5 text-amber-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed italic">
              "A great future doesn't happen by chance, it's planned."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
