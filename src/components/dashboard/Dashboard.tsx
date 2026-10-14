import React from 'react';
import { HeroBanner } from './HeroBanner';
import { StatCards } from './StatCards';
import { ApplicationsTable } from './ApplicationsTable';
import { ProgressRadial } from './ProgressRadial';
import { UpcomingDeadlines } from './UpcomingDeadlines';
import { TimelineWidget } from './TimelineWidget';
import { AchievementsWidget } from '../achievements/AchievementsWidget';
import { School } from '../../types';

interface DashboardProps {
  onAddSchool: () => void;
  onEditSchool: (school: School) => void;
  onViewSchool: (school: School) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAddSchool, onEditSchool, onViewSchool }) => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7 max-w-[1700px] mx-auto w-full relative z-10">
      {/* 1. Hero Journey Banner */}
      <HeroBanner />

      {/* 2. 5 Glowing Metric Stat Cards */}
      <StatCards />

      {/* 3. Main Grid (Left 2/3 and Right 1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3 width): Applications Table + Timeline */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <ApplicationsTable
            onAddSchool={onAddSchool}
            onEditSchool={onEditSchool}
            onViewSchool={onViewSchool}
          />
          <TimelineWidget />
        </div>

        {/* Right Column (1/3 width): Progress + Deadlines + Achievements */}
        <div className="flex flex-col gap-6">
          <ProgressRadial />
          <UpcomingDeadlines />
          <AchievementsWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
