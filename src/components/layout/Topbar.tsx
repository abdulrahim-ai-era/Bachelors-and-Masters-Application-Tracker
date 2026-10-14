import React, { useState } from 'react';
import { Bell, Search, Menu, X, ChevronDown, User, Calendar, CheckCircle2, AlertTriangle, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopbarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle, mobileMenuOpen }) => {
  const { settings, searchQuery, setSearchQuery, activityLogs, setActiveTab, upcomingDeadlines } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Dynamic notifications: urgent deadlines + recent activities
  const urgentDeadlines = upcomingDeadlines.filter(d => d.isUrgent && !d.isOverdue);
  const totalNotifications = urgentDeadlines.length + activityLogs.length;

  return (
    <header className="shrink-0 h-16 border-b border-white/[0.06] bg-[#070b18]/90 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 relative z-30">
      {/* Mobile menu toggle & brand pill */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-xs tracking-tight hidden xs:inline">GradTrack</span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-xl mx-auto px-2 sm:px-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search universities, programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0c1427]/80 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-full pl-9 pr-8 py-1.5 sm:py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-[10px] font-bold text-black rounded-full flex items-center justify-center leading-none shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#0b1329] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {totalNotifications === 0 ? 'All caught up' : `${totalNotifications} alerts`}
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                {totalNotifications === 0 ? (
                  <div className="px-4 py-8 text-center flex flex-col items-center justify-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-500 mb-1">
                      <Bell className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">No Notifications</span>
                    <span className="text-[11px] text-slate-500 max-w-[200px] leading-relaxed">
                      Upcoming deadlines and application updates will appear here.
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Urgent Deadlines */}
                    {urgentDeadlines.map(({ school, days }) => (
                      <div
                        key={school.id}
                        onClick={() => { setActiveTab('applications'); setShowNotifications(false); }}
                        className="px-4 py-3 hover:bg-white/[0.02] cursor-pointer flex items-start gap-2.5 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{school.name}</div>
                          <div className="text-[11px] text-amber-300 font-medium">
                            {days === 0 ? 'Deadline is today!' : `Deadline in ${days} ${days === 1 ? 'day' : 'days'}`}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {new Date(school.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Activity Logs */}
                    {activityLogs.map((log) => (
                      <div key={log.id} className="px-4 py-3 flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-200">{log.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{log.description}</div>
                          <div className="text-[9px] text-slate-500 mt-1">
                            {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 pr-1.5 sm:pr-3 py-1.5 rounded-full hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/10"
          >
            <div className="w-7 h-7 sm:w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md text-xs font-bold">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-semibold text-white tracking-wide hidden sm:inline truncate max-w-[100px]">
              {settings.applicantName || 'Applicant'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#0b1329] border border-white/10 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                <div className="font-bold text-white">{settings.applicantName || 'Applicant'}</div>
                <div className="text-[10px] text-slate-400">Target: {settings.targetDegree || "Master's"} Fall 2026</div>
              </div>
              <button
                onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                Account & Settings
              </button>
              <button
                onClick={() => { setActiveTab('dashboard'); setShowUserMenu(false); }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                Dashboard Overview
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
