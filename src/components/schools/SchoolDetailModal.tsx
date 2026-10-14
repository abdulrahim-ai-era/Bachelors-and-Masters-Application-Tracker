import React from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { School } from '../../types';
import { Edit3 } from 'lucide-react';

interface SchoolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
  onEdit?: (school: School) => void;
}

export const SchoolDetailModal: React.FC<SchoolDetailModalProps> = ({ isOpen, onClose, school, onEdit }) => {
  const { requirements, funding, toggleRequirementStatus, deleteSchool } = useApp();

  if (!school) return null;

  const schoolRequirements = requirements.filter(r => r.schoolId === school.id);
  const schoolFunding = funding.find(f => f.schoolId === school.id);

  const handleDelete = () => {
    // Caller should confirm before calling deleteSchool; here we call directly for simplicity.
    deleteSchool(school.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={school.name} maxWidth="lg">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-400">Program</p>
            <p className="text-lg font-medium text-slate-200">{school.program}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Degree</p>
            <p className="text-lg font-medium text-slate-200">{school.degreeType}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Country</p>
            <p className="text-lg font-medium text-slate-200">
              {school.country} {school.countryCode && <span className="inline-block ml-1">{school.countryCode}</span>}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Deadline</p>
            <p className="text-lg font-medium text-slate-200">{school.deadline}</p>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-slate-400 mb-1">Application Status</p>
          <StatusBadge status={school.status} />
        </div>

        {/* Requirements */}
        <div>
          <p className="text-sm text-slate-400 mb-2">Requirements</p>
          <ul className="space-y-2">
            {schoolRequirements.map(req => (
              <li key={req.id} className="flex items-center justify-between glass-panel p-2 rounded-md">
                <span className="text-slate-200">{req.name}</span>
                <button
                  onClick={() => toggleRequirementStatus(req.id)}
                  className="text-xs px-2 py-0.5 bg-emerald-600/30 rounded hover:bg-emerald-600/50"
                >
                  {req.status}
                </button>
              </li>
            ))}
            {schoolRequirements.length === 0 && <p className="text-sm text-slate-500">No requirements defined.</p>}
          </ul>
        </div>

        {/* Funding */}
        {schoolFunding && (
          <div>
            <p className="text-sm text-slate-400 mb-2">Funding</p>
            <div className="glass-panel p-3 rounded-md">
              <p className="text-slate-200">Amount Offered: ${(schoolFunding.amountOffered || 0).toLocaleString()} ({schoolFunding.fundingType})</p>
              <p className="text-slate-200">Tuition: ${(schoolFunding.tuitionCost || 0).toLocaleString()}</p>
              <p className="text-slate-200">Notes: {schoolFunding.notes}</p>
            </div>
          </div>
        )}

        {/* Notes */}
        {school.notes && (
          <div>
            <p className="text-sm text-slate-400 mb-2">Notes</p>
            <div className="glass-panel p-3 rounded-md">
              <p className="text-slate-200 whitespace-pre-wrap">{school.notes}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-white/[0.06] mt-4">
          <button
            onClick={handleDelete}
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors border border-rose-500/20"
          >
            Delete School
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(school);
                }}
                className="px-4 py-1.5 text-xs font-bold text-[#1a0f00] bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Edit University</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

