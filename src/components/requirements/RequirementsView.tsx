import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Requirement, School } from '../../types';
import { X } from 'lucide-react';

// Simple Requirement modal for add/edit
interface RequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  initialData?: Requirement;
}

const RequirementModal: React.FC<RequirementModalProps> = ({ isOpen, onClose, schoolId, initialData }) => {
  const { addRequirement, updateRequirement } = useApp();
  const isEdit = !!initialData;
  const [name, setName] = useState(initialData?.name ?? '');
  const [status, setStatus] = useState(initialData?.status ?? 'Not Started');
  const [notes, setNotes] = useState(initialData?.notes ?? '');

  const handleSubmit = () => {
    if (!name.trim()) return;
    const payload = { schoolId, name: name.trim(), status, notes } as any;
    if (isEdit && initialData) {
      updateRequirement(initialData.id, payload);
    } else {
      addRequirement(payload);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Requirement' : 'Add Requirement'} maxWidth="md">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded px-2 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as any)}
            className="w-full bg-white/[0.03] border border-white/10 rounded px-2 py-1.5 text-sm text-slate-200"
          >
            <option value="Not Started">Not Started</option>
            <option value="Draft">Draft</option>
            <option value="Final">Final</option>
            <option value="Submitted">Submitted</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded px-2 py-1.5 text-sm text-slate-200"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-3 py-1 text-sm text-slate-400 rounded border border-white/10 hover:bg-white/5">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-3 py-1 text-sm font-medium text-white bg-emerald-600 rounded hover:bg-emerald-500">
            {isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const RequirementsView: React.FC = () => {
  const { schools, requirements, toggleRequirementStatus, deleteRequirement, setSearchQuery } = useApp();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingReq, setEditingReq] = useState<Requirement | null>(null);

  const schoolOptions = schools.map(s => ({ value: s.id, label: `${s.name} – ${s.program}` }));

  const filteredRequirements = requirements.filter(r => (selectedSchoolId ? r.schoolId === selectedSchoolId : true));

  return (
    <div className="p-4 glass-panel rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-200">Requirements Tracker</h2>
        <button
          onClick={() => {
            setEditingReq(null);
            setShowModal(true);
          }}
          className="px-3 py-1 text-sm font-medium text-white bg-emerald-600 rounded hover:bg-emerald-500"
        >
          Add Requirement
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          value={selectedSchoolId}
          onChange={e => setSelectedSchoolId(e.target.value)}
          className="bg-white/[0.03] border border-white/10 rounded px-2 py-1 text-sm text-slate-200"
        >
          <option value="">All Schools</option>
          {schoolOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          placeholder="Search…"
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 bg-white/[0.03] border border-white/10 rounded px-2 py-1 text-sm text-slate-200"
        />
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-xs uppercase text-slate-400">
            <th className="pb-2">Requirement</th>
            <th className="pb-2">School</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequirements.map(req => {
            const school = schools.find(s => s.id === req.schoolId);
            return (
              <tr key={req.id} className="border-t border-white/5">
                <td className="py-2 text-slate-200">{req.name}</td>
                <td className="py-2 text-slate-200">{school?.name ?? '—'}</td>
                <td className="py-2">
                  <StatusBadge status={req.status} />
                </td>
                <td className="py-2 space-x-2">
                  <button
                    onClick={() => toggleRequirementStatus(req.id)}
                    className="text-xs px-2 py-0.5 bg-emerald-600/30 rounded hover:bg-emerald-600/50"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => {
                      setEditingReq(req);
                      setShowModal(true);
                    }}
                    className="text-xs px-2 py-0.5 bg-slate-600/30 rounded hover:bg-slate-600/50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRequirement(req.id)}
                    className="text-xs px-2 py-0.5 bg-red-600/30 rounded hover:bg-red-600/50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {filteredRequirements.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center text-slate-400">
                No requirements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <RequirementModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          schoolId={selectedSchoolId || schools[0]?.id || ''}
          initialData={editingReq ?? undefined}
        />
      )}
    </div>
  );
};

export default RequirementsView;
