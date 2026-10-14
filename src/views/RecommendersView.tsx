import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Mail, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2,
  Calendar,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Recommender, RecommenderStatus } from '../types';
import { getRecommenderInactivity, formatDate } from '../utils/formatters';
import { RecommenderModal } from '../components/recommenders/RecommenderModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

const STATUS_BADGE: Record<RecommenderStatus, { color: string; label: string }> = {
  'Not Requested': { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', label: 'Not Requested' },
  'Requested': { color: 'bg-amber-500/10 text-amber-300 border-amber-500/30', label: 'Requested' },
  'Confirmed': { color: 'bg-blue-500/10 text-blue-300 border-blue-500/30', label: 'Confirmed' },
  'Submitted': { color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', label: 'Submitted' },
};

export const RecommendersView: React.FC = () => {
  const { 
    recommenders, 
    schools, 
    deleteRecommender, 
    updateRecommenderSchoolStatus,
    recommenderSummary 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecommender, setEditingRecommender] = useState<Recommender | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Recommender | null>(null);

  const schoolMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    schools.forEach(s => {
      map[s.id] = s.name;
    });
    return map;
  }, [schools]);

  const handleOpenAdd = () => {
    setEditingRecommender(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: Recommender) => {
    setEditingRecommender(rec);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7 max-w-[1700px] mx-auto w-full relative z-10">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              <h1 className="text-2xl font-black text-white tracking-tight">Letters of Recommendation</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Track professor & mentor recommendations, submission deadlines, and follow-up timelines.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-black rounded-2xl text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0 transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Recommender</span>
          </button>
        </div>

        {/* Recommender Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/[0.06]">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-400">Total Recommenders</div>
            <div className="text-xl font-black text-white mt-1">{recommenderSummary.total}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-emerald-400">Submitted / Confirmed</div>
            <div className="text-xl font-black text-emerald-300 mt-1">{recommenderSummary.confirmedOrSubmitted}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-amber-400">Pending Submissions</div>
            <div className="text-xl font-black text-amber-300 mt-1">{recommenderSummary.pending}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-rose-400">Needs Follow-Up</div>
            <div className="text-xl font-black text-rose-300 mt-1">{recommenderSummary.flaggedInactive}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      {recommenders.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border border-white/[0.08] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Recommenders Added Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            Keep track of professors and supervisors writing your recommendations. Monitor which schools they have submitted for.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-black rounded-full text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Your First Recommender</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommenders.map(rec => {
            const inactivity = getRecommenderInactivity(rec.lastContactedDate);
            const initials = rec.name
              .split(' ')
              .map(w => w[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={rec.id}
                className="glass-panel rounded-3xl p-5 border border-white/[0.08] shadow-xl flex flex-col justify-between hover:border-amber-400/30 transition-all"
              >
                <div>
                  {/* Top Bar: Avatar, Info, Actions */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-cyan-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-black text-sm shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{rec.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{rec.relationship || 'Recommender'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(rec)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/[0.05] rounded-xl transition-colors"
                        title="Edit Recommender"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(rec)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-xl transition-colors"
                        title="Delete Recommender"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Institution & Contact Info */}
                  <div className="space-y-2 mb-4 text-xs text-slate-300 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                    {rec.institution && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{rec.institution}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <a 
                        href={`mailto:${rec.email}`} 
                        className="text-amber-400/90 hover:text-amber-300 hover:underline truncate"
                      >
                        {rec.email}
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Last Contact: {rec.lastContactedDate ? formatDate(rec.lastContactedDate) : 'Not recorded'}</span>
                      </div>
                      {inactivity.isInactive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> Follow Up!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* University Submissions Breakdown */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Assigned Applications ({rec.schoolSubmissions.length})
                    </div>
                    {rec.schoolSubmissions.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">No universities assigned.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {rec.schoolSubmissions.map(sub => {
                          const schoolName = schoolMap[sub.schoolId] || 'University';
                          const badge = STATUS_BADGE[sub.status] || STATUS_BADGE['Requested'];
                          return (
                            <div
                              key={sub.schoolId}
                              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs"
                            >
                              <span className="font-medium text-slate-200 truncate mr-2">{schoolName}</span>
                              <select
                                value={sub.status}
                                onChange={e => updateRecommenderSchoolStatus(rec.id, sub.schoolId, e.target.value as RecommenderStatus)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-[#0a1224] focus:outline-none cursor-pointer ${badge.color}`}
                              >
                                <option value="Not Requested">Not Requested</option>
                                <option value="Requested">Requested</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Submitted">Submitted</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Follow up button */}
                <div className="mt-4 pt-3 border-t border-white/[0.05]">
                  <a
                    href={`mailto:${rec.email}?subject=Grad%20School%20Recommendation%20Follow-up`}
                    className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Email Follow-Up</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <RecommenderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecommender(null);
        }}
        recommender={editingRecommender}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteRecommender(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Remove Recommender"
        message={`Are you sure you want to remove "${deleteTarget?.name}"?`}
      />
    </div>
  );
};

export default RecommendersView;
