import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { School, Recommender, RecommenderStatus } from '../../types';

interface RecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommender?: Recommender | null;
}

export const RecommenderModal: React.FC<RecommenderModalProps> = ({ isOpen, onClose, recommender }) => {
  const { addRecommender, updateRecommender, schools } = useApp();
  const isEdit = Boolean(recommender);

  const [form, setForm] = useState({
    name: '',
    email: '',
    relationship: '',
    institution: '',
    lastContactedDate: '',
    selectedSchools: {} as Record<string, RecommenderStatus>,
  });

  useEffect(() => {
    if (recommender) {
      const schoolSubMap: Record<string, RecommenderStatus> = {};
      recommender.schoolSubmissions.forEach(sub => {
        schoolSubMap[sub.schoolId] = sub.status;
      });
      setForm({
        name: recommender.name,
        email: recommender.email,
        relationship: recommender.relationship,
        institution: recommender.institution || '',
        lastContactedDate: recommender.lastContactedDate || '',
        selectedSchools: schoolSubMap,
      });
    } else {
      setForm({
        name: '',
        email: '',
        relationship: '',
        institution: '',
        lastContactedDate: new Date().toISOString().split('T')[0],
        selectedSchools: {},
      });
    }
  }, [recommender, isOpen]);

  const handleToggleSchool = (schoolId: string) => {
    setForm(prev => {
      const next = { ...prev.selectedSchools };
      if (next[schoolId]) {
        delete next[schoolId];
      } else {
        next[schoolId] = 'Requested';
      }
      return { ...prev, selectedSchools: next };
    });
  };

  const handleSchoolStatusChange = (schoolId: string, status: RecommenderStatus) => {
    setForm(prev => ({
      ...prev,
      selectedSchools: {
        ...prev.selectedSchools,
        [schoolId]: status,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const schoolSubmissions = Object.entries(form.selectedSchools).map(([schoolId, status]) => ({
      schoolId,
      status,
    }));

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      relationship: form.relationship.trim(),
      institution: form.institution.trim(),
      lastContactedDate: form.lastContactedDate || new Date().toISOString().split('T')[0],
      schoolSubmissions,
    };

    if (isEdit && recommender) {
      updateRecommender(recommender.id, payload);
    } else {
      addRecommender(payload);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Recommender' : 'Add Recommender'} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Prof. David Miller"
              className="w-full bg-[#0a1224] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. d.miller@univ.edu"
              className="w-full bg-[#0a1224] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Relationship</label>
            <input
              value={form.relationship}
              onChange={e => setForm({ ...form, relationship: e.target.value })}
              placeholder="e.g. Thesis Advisor / Manager"
              className="w-full bg-[#0a1224] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institution / Company</label>
            <input
              value={form.institution}
              onChange={e => setForm({ ...form, institution: e.target.value })}
              placeholder="e.g. Department of Computer Science"
              className="w-full bg-[#0a1224] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Contacted Date</label>
            <input
              type="date"
              value={form.lastContactedDate}
              onChange={e => setForm({ ...form, lastContactedDate: e.target.value })}
              className="w-full bg-[#0a1224] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        </div>

        {/* Assigned Universities */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-300 mb-2">Assign to Universities</p>
          {schools.length === 0 ? (
            <p className="text-xs text-slate-500 italic bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
              No universities added yet. You can attach recommenders to universities after adding them.
            </p>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {schools.map(school => {
                const isSelected = Boolean(form.selectedSchools[school.id]);
                const status = form.selectedSchools[school.id] || 'Requested';
                return (
                  <div
                    key={school.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      isSelected ? 'bg-amber-400/[0.08] border-amber-400/30' : 'bg-white/[0.02] border-white/[0.06]'
                    }`}
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer select-none flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSchool(school.id)}
                        className="rounded accent-amber-400"
                      />
                      <span className="text-xs font-medium text-slate-200">{school.name}</span>
                      <span className="text-[11px] text-slate-400">({school.program})</span>
                    </label>

                    {isSelected && (
                      <select
                        value={status}
                        onChange={e => handleSchoolStatusChange(school.id, e.target.value as RecommenderStatus)}
                        className="bg-[#0a1224] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-400/50"
                      >
                        <option value="Not Requested">Not Requested</option>
                        <option value="Requested">Requested</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Submitted">Submitted</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-[#1a0f00] bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all"
          >
            {isEdit ? 'Save Changes' : 'Add Recommender'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
