import React, { useState } from 'react';
import { Plus, Building2, Eye, Edit3, Trash2, Clock, FileText, Download, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { getCountryFlag } from '../../utils/formatters';
import { School, ApplicationStatus, SchoolCategory } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportToPDF } from '../../utils/exportPDF';
import { exportToCSV } from '../../utils/exportCSV';

interface ApplicationsTableProps {
  onAddSchool: () => void;
  onEditSchool: (school: School) => void;
  onViewSchool: (school: School) => void;
}

type FilterTab = 'All' | 'Applied' | 'In Progress' | 'Offers' | 'Rejected';

const CATEGORY_STYLES: Record<SchoolCategory, string> = {
  Safety: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  Target: 'bg-blue-400/15 text-blue-300 border-blue-400/30',
  Reach: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  Dream: 'bg-rose-400/15 text-rose-300 border-rose-400/30',
};

const CATEGORY_DOT: Record<SchoolCategory, string> = {
  Safety: 'bg-emerald-400',
  Target: 'bg-blue-400',
  Reach: 'bg-amber-400',
  Dream: 'bg-rose-400',
};

function getCountdownBadge(deadline: string) {
  if (!deadline) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const days = Math.ceil((deadlineDate.getTime() - now.getTime()) / 86400000);

  if (days < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
        <Clock className="w-2.5 h-2.5" /> Overdue
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
        <Clock className="w-2.5 h-2.5" /> Today!
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
        <Clock className="w-2.5 h-2.5" /> {days}d left
      </span>
    );
  }
  if (days <= 14) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <Clock className="w-2.5 h-2.5" /> {days}d left
      </span>
    );
  }
  if (days <= 30) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
        <Clock className="w-2.5 h-2.5" /> {days}d left
      </span>
    );
  }
  // More than 30 days — just show the date
  return (
    <span className="text-xs text-slate-300 font-medium">
      {new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    </span>
  );
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  onAddSchool,
  onEditSchool,
  onViewSchool,
}) => {
  const { schools, requirements, settings, searchQuery, deleteSchool } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null);

  // Compute counts dynamically
  const counts = {
    all: schools.length,
    applied: schools.filter(s => s.status === 'Submitted').length,
    inProgress: schools.filter(s => s.status === 'In Progress' || s.status === 'Researching' || s.status === 'Interview').length,
    offers: schools.filter(s => s.status === 'Accepted').length,
    rejected: schools.filter(s => s.status === 'Rejected').length,
  };

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'All', label: `All (${counts.all})` },
    { id: 'Applied', label: `Applied (${counts.applied})` },
    { id: 'In Progress', label: `In Progress (${counts.inProgress})` },
    { id: 'Offers', label: `Offers (${counts.offers})` },
    { id: 'Rejected', label: `Rejected (${counts.rejected})` },
  ];

  const filteredSchools = schools.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.program.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q);

    let matchesTab = true;
    if (activeTab === 'Applied') matchesTab = s.status === 'Submitted';
    else if (activeTab === 'In Progress') matchesTab = s.status === 'In Progress' || s.status === 'Researching' || s.status === 'Interview';
    else if (activeTab === 'Offers') matchesTab = s.status === 'Accepted';
    else if (activeTab === 'Rejected') matchesTab = s.status === 'Rejected';

    return matchesSearch && matchesTab;
  });

  // Precompute docs progress per school
  const docsProgress: Record<string, { done: number; total: number }> = {};
  requirements.forEach(r => {
    if (!docsProgress[r.schoolId]) docsProgress[r.schoolId] = { done: 0, total: 0 };
    docsProgress[r.schoolId].total++;
    if (r.status === 'Submitted') docsProgress[r.schoolId].done++;
  });

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl flex flex-col">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-white/[0.06]">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <h2 className="text-base font-bold text-white tracking-wide">My Applications</h2>
        </div>

        {/* Filter Pills & Add School Button */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400/15 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {schools.length > 0 && (
            <>
              <button
                onClick={() => exportToCSV(schools, requirements, settings)}
                className="ml-2 px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 font-semibold rounded-full text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                title="Export to Excel / CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={() => exportToPDF(schools, requirements, settings)}
                className="ml-1 px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 font-semibold rounded-full text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                title="Export printable PDF report"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </>
          )}

          <button
            onClick={onAddSchool}
            className="ml-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-[#1a0f00] font-bold rounded-full text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add University</span>
          </button>
        </div>
      </div>

      {/* Table Content or Empty State */}
      {filteredSchools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {schools.length === 0 ? 'No Applications Added Yet' : 'No Matching Applications Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
            {schools.length === 0
              ? 'Start building your application list. Track deadlines, requirements, and decisions across universities.'
              : 'Try adjusting your search query or switching to another filter tab.'}
          </p>
          <button
            onClick={onAddSchool}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-bold rounded-full text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Your First University</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.04] text-slate-400 text-[11px] font-medium">
                <th className="px-6 py-3.5">University / Program</th>
                <th className="px-4 py-3.5">Country</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Deadline</th>
                <th className="px-4 py-3.5">Docs</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredSchools.map((school) => {
                const initials = school.name
                  .split(' ')
                  .map(w => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                const docs = docsProgress[school.id] || { done: 0, total: 0 };
                const docsPercent = docs.total > 0 ? Math.round((docs.done / docs.total) * 100) : 0;

                return (
                  <tr
                    key={school.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => onViewSchool(school)}
                  >
                    {/* University / Program with badge */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-md shrink-0">
                          {initials || school.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs leading-snug group-hover:text-amber-300 transition-colors">
                            {school.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                            {school.degreeType && <span className="text-slate-500">{school.degreeType}</span>}
                            {school.program}
                            {school.category && (
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[9px] font-bold border ${CATEGORY_STYLES[school.category]}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[school.category]}`} />
                                {school.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-300 font-medium">
                        <span className="text-base">{getCountryFlag(school.countryCode)}</span>
                        <span className="text-xs">{school.country}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4">
                      <StatusBadge status={school.status} />
                    </td>

                    {/* Deadline with countdown */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {getCountdownBadge(school.deadline)}
                      </div>
                    </td>

                    {/* Docs progress */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-slate-500 shrink-0" />
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-[11px] font-semibold ${docsPercent === 100 ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {docs.done}/{docs.total}
                          </span>
                          {docs.total > 0 && (
                            <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${docsPercent === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                style={{ width: `${docsPercent}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Action View & Edit Buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewSchool(school);
                          }}
                          className="px-4 py-1 rounded-full border border-amber-500/50 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditSchool(school);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/[0.05] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(school);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteSchool(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Remove University"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your application tracker?`}
      />
    </div>
  );
};
