import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { isValidDate, isPositiveNumber } from '../../utils/validators';
import { SchoolCategory } from '../../types';

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editSchoolId?: string | null; // Pass this for edit mode
  initialData?: {
    name: string;
    program: string;
    degreeType: string;
    country: string;
    countryCode: string;
    deadline: string;
    status: string;
    applicationFee: number;
    portalUrl: string;
    notes: string;
    category?: SchoolCategory;
  };
}

const CATEGORIES: { value: SchoolCategory | ''; label: string; desc: string }[] = [
  { value: '', label: 'No Category', desc: '' },
  { value: 'Safety', label: '🟢 Safety', desc: 'High confidence of admission' },
  { value: 'Target', label: '🔵 Target', desc: 'Realistic match for your profile' },
  { value: 'Reach', label: '🟡 Reach', desc: 'Competitive, ambitious choice' },
  { value: 'Dream', label: '🔴 Dream', desc: 'Long shot — worth trying!' },
];

export const SchoolFormModal: React.FC<SchoolFormModalProps> = ({ isOpen, onClose, editSchoolId, initialData }) => {
  const { addSchool, updateSchool } = useApp();
  const isEdit = Boolean(initialData) && Boolean(editSchoolId);

  const [form, setForm] = useState({
    name: '',
    program: '',
    degreeType: "Master's" as const,
    country: '',
    countryCode: '',
    deadline: '',
    status: 'Researching' as const,
    applicationFee: '' as unknown as string,
    portalUrl: '',
    notes: '',
    category: '' as SchoolCategory | '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        program: initialData.program,
        degreeType: initialData.degreeType as any,
        country: initialData.country,
        countryCode: initialData.countryCode,
        deadline: initialData.deadline,
        status: initialData.status as any,
        applicationFee: String(initialData.applicationFee),
        portalUrl: initialData.portalUrl,
        notes: initialData.notes,
        category: initialData.category || '',
      });
    } else {
      // Reset form when opening for new entry
      setForm({
        name: '',
        program: '',
        degreeType: "Master's" as any,
        country: '',
        countryCode: '',
        deadline: '',
        status: 'Researching' as any,
        applicationFee: '' as any,
        portalUrl: '',
        notes: '',
        category: '',
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'University name required';
    if (!form.program.trim()) newErrors.program = 'Program name required';
    if (!form.country.trim()) newErrors.country = 'Country required';
    if (!isValidDate(form.deadline)) newErrors.deadline = 'Invalid date (YYYY-MM-DD)';
    if (!isPositiveNumber(form.applicationFee)) newErrors.applicationFee = 'Must be a positive number';
    if (form.portalUrl && !form.portalUrl.startsWith('http')) newErrors.portalUrl = 'Must be a valid URL';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      program: form.program.trim(),
      degreeType: form.degreeType,
      country: form.country.trim(),
      countryCode: form.countryCode.trim() || '',
      deadline: form.deadline,
      status: form.status,
      applicationFee: Number(form.applicationFee),
      portalUrl: form.portalUrl.trim(),
      notes: form.notes.trim(),
      category: form.category || undefined,
    };
    if (isEdit && editSchoolId) {
      updateSchool(editSchoolId, payload);
    } else {
      addSchool(payload);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit School' : 'Add New School'} maxWidth="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* University */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">University *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full bg-white/[0.03] border rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 ${errors.name ? 'border-red-500' : 'border-white/10'}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>
        {/* Program */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Program *</label>
          <input
            name="program"
            value={form.program}
            onChange={handleChange}
            className={`w-full bg-white/[0.03] border rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 ${errors.program ? 'border-red-500' : 'border-white/10'}`}
          />
          {errors.program && <p className="mt-1 text-xs text-red-400">{errors.program}</p>}
        </div>
        {/* Degree Type */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Degree Type</label>
          <select
            name="degreeType"
            value={form.degreeType}
            onChange={handleChange}
            className="w-full bg-[#0a1224] border border-white/10 rounded-md px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400/60"
          >
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Bachelors">Bachelors</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Master's">Master's</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="PhD">PhD</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="MEng">MEng</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="MBA">MBA</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Other">Other</option>
          </select>
        </div>
        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-[#0a1224] border border-white/10 rounded-md px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400/60"
          >
            {CATEGORIES.map(cat => (
              <option className="bg-[#0a1224] text-slate-100 py-1" key={cat.value} value={cat.value}>
                {cat.label}{cat.desc ? ` — ${cat.desc}` : ''}
              </option>
            ))}
          </select>
        </div>
        {/* Country */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Country *</label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            className={`w-full bg-white/[0.03] border rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 ${errors.country ? 'border-red-500' : 'border-white/10'}`}
          />
          {errors.country && <p className="mt-1 text-xs text-red-400">{errors.country}</p>}
        </div>
        {/* Country Code */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Country Code (e.g. US, GB)</label>
          <input
            name="countryCode"
            value={form.countryCode}
            onChange={handleChange}
            placeholder="US"
            maxLength={2}
            className="w-full bg-white/[0.03] border border-white/10 rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 uppercase"
          />
        </div>
        {/* Deadline */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Deadline (YYYY-MM-DD) *</label>
          <input
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            type="date"
            className={`w-full bg-white/[0.03] border rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 ${errors.deadline ? 'border-red-500' : 'border-white/10'}`}
          />
          {errors.deadline && <p className="mt-1 text-xs text-red-400">{errors.deadline}</p>}
        </div>
        {/* Application Fee */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Application Fee</label>
          <input
            name="applicationFee"
            value={form.applicationFee}
            onChange={handleChange}
            placeholder="150"
            className={`w-full bg-white/[0.03] border rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 ${errors.applicationFee ? 'border-red-500' : 'border-white/10'}`}
          />
          {errors.applicationFee && <p className="mt-1 text-xs text-red-400">{errors.applicationFee}</p>}
        </div>
        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-[#0a1224] border border-white/10 rounded-md px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400/60"
          >
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Researching">Researching</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="In Progress">In Progress</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Submitted">Submitted</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Interview">Interview</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Accepted">Accepted</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Waitlisted">Waitlisted</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Rejected">Rejected</option>
            <option className="bg-[#0a1224] text-slate-100 py-1" value="Declined">Declined</option>
          </select>
        </div>
        {/* Portal URL */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Portal URL</label>
          <input
            name="portalUrl"
            value={form.portalUrl}
            onChange={handleChange}
            placeholder="https://apply.university.edu"
            className={`w-full bg-white/[0.03] border rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 ${errors.portalUrl ? 'border-red-500' : 'border-white/10'}`}
          />
          {errors.portalUrl && <p className="mt-1 text-xs text-red-400">{errors.portalUrl}</p>}
        </div>
        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full bg-white/[0.03] border border-white/10 rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 rounded-lg border border-white/10 hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
        >
          {isEdit ? 'Save Changes' : 'Add School'}
        </button>
      </div>
    </Modal>
  );
};
