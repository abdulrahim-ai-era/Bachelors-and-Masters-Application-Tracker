import React from 'react';
import { Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AchievementId } from '../../types';
import { ACHIEVEMENT_META } from './AchievementToast';

const ALL_ACHIEVEMENT_IDS: AchievementId[] = [
  'first_school',
  'five_schools',
  'ten_schools',
  'first_submission',
  'first_offer',
  'global_explorer',
  'deadline_crusher',
  'fully_funded',
];

export const AchievementsWidget: React.FC = () => {
  const { achievements } = useApp();
  const unlockedIds = new Set(achievements.map(a => a.id));
  const unlockedCount = unlockedIds.size;

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <h3 className="text-sm font-bold text-white tracking-wide">Achievements</h3>
        </div>
        <span className="text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
          {unlockedCount}/{ALL_ACHIEVEMENT_IDS.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/[0.06] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          style={{ width: `${(unlockedCount / ALL_ACHIEVEMENT_IDS.length) * 100}%` }}
        />
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-4 gap-2">
        {ALL_ACHIEVEMENT_IDS.map((id) => {
          const meta = ACHIEVEMENT_META[id];
          const isUnlocked = unlockedIds.has(id);
          return (
            <div
              key={id}
              className="relative group"
              title={isUnlocked ? `${meta.title} — ${meta.description}` : `Locked: ${meta.title}`}
            >
              <div
                className={`w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                  isUnlocked
                    ? `bg-gradient-to-br ${meta.color} ${meta.glow} scale-100`
                    : 'bg-white/[0.03] border border-white/[0.06] opacity-30 grayscale'
                }`}
              >
                {meta.icon}
              </div>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                <div className="bg-[#0a1224] border border-white/10 rounded-xl px-3 py-2 w-36 shadow-xl">
                  <div className="text-[10px] font-black text-white leading-tight">{meta.title}</div>
                  {isUnlocked ? (
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">✓ Unlocked</div>
                  ) : (
                    <div className="text-[10px] text-slate-500 mt-0.5">{meta.description}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {unlockedCount === 0 && (
        <p className="text-center text-[11px] text-slate-500 mt-3">
          Add your first university to unlock achievements!
        </p>
      )}
    </div>
  );
};

