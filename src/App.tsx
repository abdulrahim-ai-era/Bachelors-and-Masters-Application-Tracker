import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DashboardView } from './views/DashboardView';
import { ApplicationsView } from './views/ApplicationsView';
import { TimelineView } from './views/TimelineView';
import { FundingComparisonView } from './views/FundingComparisonView';
import { SettingsView } from './views/SettingsView';
import { ResourcesView } from './views/ResourcesView';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { AchievementToast } from './components/achievements/AchievementToast';

const AppContent: React.FC = () => {
  const { activeTab, pendingAchievement, dismissAchievement } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'applications':
      case 'universities':
      case 'programs':
        return <ApplicationsView />;
      case 'documents':
      case 'requirements': {
        const RequirementsView = React.lazy(() => import('./components/requirements/RequirementsView'));
        return (
          <React.Suspense fallback={<div className="p-6 text-slate-400">Loading Documents…</div>}>
            <RequirementsView />
          </React.Suspense>
        );
      }
      case 'scholarships':
      case 'funding':
        return <FundingComparisonView />;
      case 'timeline':
        return <TimelineView />;
      case 'resources':
        return <ResourcesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#060913] text-slate-200 relative select-none">
      {/* Planetary Atmosphere Flare in Bottom-Left (from reference screenshot) */}
      <div className="fixed -bottom-40 -left-40 w-[550px] h-[550px] pointer-events-none z-0 overflow-hidden">
        {/* Diffuse glowing atmosphere */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,_rgba(245,158,11,0.22)_0%,_rgba(6,182,212,0.18)_25%,_rgba(16,185,129,0.1)_45%,_transparent_75%)] blur-2xl" />
        {/* Planetary surface crescent arc */}
        <div className="absolute inset-4 rounded-full border-t-[3px] border-l-[3px] border-amber-400/50 shadow-[0_0_60px_rgba(245,158,11,0.4)] opacity-80" />
      </div>

      {/* Subtle ambient light spots in top right */}
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.08)_0%,_transparent_70%)] blur-3xl pointer-events-none z-0" />

      {/* Left Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Topbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
        <footer className="shrink-0 py-2 px-4 sm:px-6 border-t border-white/[0.05] bg-[#070b18]/60 backdrop-blur-sm text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">GradTrack</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Application Management System</span>
          </div>
          <div>
            <span>Created by <strong className="text-amber-400/90 font-medium">Abdul Rahim</strong></span>
            <span className="text-slate-600 mx-1.5">•</span>
            <span>All Rights Reserved</span>
          </div>
        </footer>
      </div>

      {/* Achievement Toast — rendered globally on top of everything */}
      {pendingAchievement && (
        <AchievementToast
          key={pendingAchievement.id + pendingAchievement.unlockedAt}
          achievement={pendingAchievement}
          onDismiss={dismissAchievement}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
