import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { School, SchoolCategory, ApplicationStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { getCountryFlag, formatDate } from '../utils/formatters';
import { SchoolDetailModal } from '../components/schools/SchoolDetailModal';
import { SchoolFormModal } from '../components/schools/SchoolFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { exportToPDF } from '../utils/exportPDF';
import { exportToCSV } from '../utils/exportCSV';

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
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
        <Clock className="w-2.5 h-2.5" /> Overdue
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
        <Clock className="w-2.5 h-2.5" /> Due Today!
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
        <Clock className="w-2.5 h-2.5" /> {days} days left
      </span>
    );
  }
  if (days <= 14) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <Clock className="w-2.5 h-2.5" /> {days} days left
      </span>
    );
  }
  if (days <= 30) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
        <Clock className="w-2.5 h-2.5" /> {days} days left
      </span>
    );
  }
  return (
    <span className="text-xs text-slate-300 font-medium">
      {formatDate(deadline)}
    </span>
  );
}

export const ApplicationsView: React.FC = () => {
  const { 
    schools, 
    requirements, 
    settings, 
    deleteSchool, 
    submittedCount, 
    inProgressCount, 
    offersCount,
    countriesCount
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modals state
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null);

  // Docs progress lookup
  const docsProgress = useMemo(() => {
    const map: Record<string, { done: number; total: number }> = {};
    requirements.forEach(r => {
      if (!map[r.schoolId]) map[r.schoolId] = { done: 0, total: 0 };
      map[r.schoolId].total++;
      if (r.status === 'Submitted') map[r.schoolId].done++;
    });
    return map;
  }, [requirements]);

  // Filtered list
  const filteredSchools = useMemo(() => {
    return schools.filter(s => {
      const q = search.toLowerCase();
      const matchesSearch = !q || 
        s.name.toLowerCase().includes(q) || 
        s.program.toLowerCase().includes(q) || 
        s.country.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [schools, search, selectedStatus, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingSchool(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (school: School) => {
    setEditingSchool(school);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (school: School) => {
    setSelectedSchool(school);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7 max-w-[1700px] mx-auto w-full relative z-10">
      {/* Top Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              <h1 className="text-2xl font-black text-white tracking-tight">University Applications</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Organize, track deadlines, and monitor your admissions status across target programs worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {schools.length > 0 && (
              <>
                <button
                  onClick={() => exportToCSV(schools, requirements, settings)}
                  className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 font-semibold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md"
                  title="Export to Excel / CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => exportToPDF(schools, requirements, settings)}
                  className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 font-semibold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Export PDF</span>
                </button>
              </>
            )}

            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-black rounded-2xl text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/[0.06]">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-400">Total Applications</div>
            <div className="text-xl font-black text-white mt-1">{schools.length}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-blue-400">Submitted</div>
            <div className="text-xl font-black text-blue-300 mt-1">{submittedCount}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-amber-400">In Progress</div>
            <div className="text-xl font-black text-amber-300 mt-1">{inProgressCount}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-emerald-400">Offers Received</div>
            <div className="text-xl font-black text-emerald-300 mt-1">{offersCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/[0.08] shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities, programs, countries..."
            className="w-full bg-[#0a1224] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
          />
        </div>

        {/* Filter Dropdowns & Category Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0 scrollbar-none flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0a1224] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50"
            >
              <option className="bg-[#0a1224] text-slate-100 py-1" value="All">All Statuses</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Researching">Researching</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="In Progress">In Progress</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Submitted">Submitted</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Interview">Interview</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Accepted">Accepted</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Waitlisted">Waitlisted</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0a1224] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50"
            >
              <option className="bg-[#0a1224] text-slate-100 py-1" value="All">All Categories</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Safety">🟢 Safety</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Target">🔵 Target</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Reach">🟡 Reach</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Dream">🔴 Dream</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table or Empty State */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl flex flex-col">
        {filteredSchools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {schools.length === 0 ? 'No Universities Added Yet' : 'No Matching Applications Found'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
              {schools.length === 0
                ? 'Begin your higher education journey by tracking your target universities, required documents, and admission deadlines.'
                : 'Try adjusting your search criteria or resetting filters to view all entries.'}
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-black rounded-full text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Your First University</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 text-[11px] font-medium bg-white/[0.01]">
                  <th className="px-6 py-4">University & Program</th>
                  <th className="px-4 py-4">Country</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Deadline</th>
                  <th className="px-4 py-4">Documents</th>
                  <th className="px-6 py-4 text-right">Actions</th>
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
                      onClick={() => handleOpenDetail(school)}
                    >
                      {/* Name, Program & Category Badge */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-md shrink-0">
                            {initials || school.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs leading-snug group-hover:text-amber-300 transition-colors flex items-center gap-2">
                              <span>{school.name}</span>
                              {school.portalUrl && (
                                <a
                                  href={school.portalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-slate-500 hover:text-amber-400 transition-colors"
                                  title="Open Application Portal"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                              {school.degreeType && <span className="text-slate-500 font-medium">{school.degreeType}</span>}
                              <span>{school.program}</span>
                              {school.category && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${CATEGORY_STYLES[school.category]}`}>
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

                      {/* Deadline Countdown */}
                      <td className="px-4 py-4">
                        {getCountdownBadge(school.deadline)}
                      </td>

                      {/* Docs Checklist Progress */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <div className="flex flex-col gap-1">
                            <span className={`text-[11px] font-semibold ${docsPercent === 100 ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {docs.done}/{docs.total} Ready
                            </span>
                            {docs.total > 0 && (
                              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${docsPercent === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                  style={{ width: `${docsPercent}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(school);
                            }}
                            className="px-3.5 py-1 rounded-full border border-amber-500/50 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(school);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/[0.05] rounded-xl transition-colors"
                            title="Edit School"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(school);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-xl transition-colors"
                            title="Delete School"
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
      </div>

      {/* Modals */}
      <SchoolDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSchool(null);
        }}
        school={selectedSchool}
        onEdit={handleOpenEdit}
      />

      <SchoolFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSchool(null);
        }}
        editSchoolId={editingSchool?.id ?? null}
        initialData={
          editingSchool
            ? {
                name: editingSchool.name,
                program: editingSchool.program,
                degreeType: editingSchool.degreeType,
                country: editingSchool.country,
                countryCode: editingSchool.countryCode,
                deadline: editingSchool.deadline,
                status: editingSchool.status,
                applicationFee: editingSchool.applicationFee,
                portalUrl: editingSchool.portalUrl,
                notes: editingSchool.notes,
                category: editingSchool.category,
              }
            : undefined
        }
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteSchool(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Remove University"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your application list? All associated document checklists and records will also be removed.`}
      />
    </div>
  );
};

export default ApplicationsView;
