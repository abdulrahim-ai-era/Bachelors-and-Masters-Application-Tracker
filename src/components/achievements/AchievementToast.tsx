import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Achievement, AchievementId } from '../../types';

interface AchievementMeta {
  icon: string;
  title: string;
  description: string;
  color: string;
  glow: string;
}

export const ACHIEVEMENT_META: Record<AchievementId, AchievementMeta> = {
  first_school: {
    icon: '🎓',
    title: 'First Step!',
    description: 'You added your first university to the tracker.',
    color: 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/40',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
  },
  five_schools: {
    icon: '🏫',
    title: '5 Schools Shortlisted',
    description: 'You\'re building a solid application list!',
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
  },
  ten_schools: {
    icon: '🌟',
    title: 'Dream Big! 10 Schools',
    description: 'You\'ve shortlisted 10 universities — impressive!',
    color: 'from-violet-500/20 to-purple-500/10 border-violet-500/40',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
  },
  first_submission: {
    icon: '📬',
    title: 'Application Submitted!',
    description: 'Your first application is officially in. Good luck!',
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
  },
  first_offer: {
    icon: '🏆',
    title: 'Offer Received!',
    description: 'Congratulations! You received your first admission offer!',
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40',
    glow: 'shadow-[0_0_40px_rgba(245,158,11,0.4)]',
  },
  global_explorer: {
    icon: '🌍',
    title: 'Global Explorer',
    description: 'Applying to universities in 3+ countries. World-class aspirations!',
    color: 'from-teal-500/20 to-cyan-500/10 border-teal-500/40',
    glow: 'shadow-[0_0_30px_rgba(20,184,166,0.3)]',
  },
  deadline_crusher: {
    icon: '⚡',
    title: 'Deadline Crusher',
    description: 'Submitted an application 7+ days before the deadline!',
    color: 'from-orange-500/20 to-red-500/10 border-orange-500/40',
    glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]',
  },
  fully_funded: {
    icon: '💰',
    title: 'Fully Funded!',
    description: 'You have a funding offer that covers full tuition. Amazing!',
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/40',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
  },
};

interface AchievementToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  const meta = ACHIEVEMENT_META[achievement.id];

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Auto-dismiss after 5s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 5000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onDismiss]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  if (!meta) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}
    >
      <div
        className={`relative flex items-center gap-4 bg-gradient-to-br ${meta.color} backdrop-blur-xl border rounded-2xl px-5 py-4 max-w-sm ${meta.glow}`}
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute -inset-[100%] animate-[spin_3s_linear_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0 shadow-inner">
          {meta.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5">
            Achievement Unlocked!
          </div>
          <div className="text-sm font-black text-white leading-tight">{meta.title}</div>
          <div className="text-[11px] text-white/70 mt-0.5 leading-snug">{meta.description}</div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

