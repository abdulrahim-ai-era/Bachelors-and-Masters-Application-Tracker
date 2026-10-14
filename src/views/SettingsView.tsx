import React, { useState } from 'react';
import { User, DollarSign, Download, Upload, Trash2, Sparkles, Check, FileText, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DegreeType } from '../types';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { exportToPDF } from '../utils/exportPDF';
import { exportToCSV } from '../utils/exportCSV';

export const SettingsView: React.FC = () => {
  const {
    settings,
    schools,
    requirements,
    updateSettings,
    clearAllData,
    loadSampleData,
    exportDataJSON,
    importDataJSON,
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);

  const [form, setForm] = useState({
    applicantName: settings.applicantName || '',
    targetDegree: settings.targetDegree || "Master's",
    homeCountry: settings.homeCountry || '',
    currency: settings.currency || '$',
    targetIntake: settings.targetIntake || 'Fall 2026',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataJSON(content);
      if (res.success) {
        alert('Data backup successfully imported!');
      } else {
        alert(`Failed to import backup: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-5 bg-amber-400 rounded-full" />
          <h1 className="text-xl font-extrabold text-white tracking-tight">Profile & Workspace Settings</h1>
        </div>
        <p className="text-xs text-slate-400">
          Personalize your admissions dashboard, currency settings, and manage data backups.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white">Applicant Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={form.applicantName}
              onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
              className="w-full bg-[#0a1224] border border-white/10 focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Degree</label>
            <select
              value={form.targetDegree}
              onChange={(e) => setForm({ ...form, targetDegree: e.target.value as DegreeType })}
              className="w-full bg-[#0a1224] border border-white/10 focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors"
            >
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Bachelors">Bachelors</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Master's">Master's</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="PhD">PhD</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="MEng">MEng</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="MBA">MBA</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Intake Season</label>
            <input
              type="text"
              placeholder="e.g. Fall 2026"
              value={form.targetIntake}
              onChange={(e) => setForm({ ...form, targetIntake: e.target.value })}
              className="w-full bg-[#0a1224] border border-white/10 focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Currency Symbol</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full bg-[#0a1224] border border-white/10 focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors"
            >
              <option className="bg-[#0a1224] text-slate-100 py-1" value="$">$ (USD / CAD / AUD)</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="€">€ (EUR)</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="£">£ (GBP)</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="CHF">CHF (Swiss Franc)</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="₹">₹ (INR)</option>
              <option className="bg-[#0a1224] text-slate-100 py-1" value="¥">¥ (JPY / CNY)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all"
          >
            Save Profile Settings
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white">Data Management & Template Reset</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Clear Data (Reset to Fresh Blank Product) */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white mb-1">Clear All Data (Start Fresh)</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Wipe all universities, requirements, deadlines, and funding records to start with a clean slate.
              </p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2 px-3 rounded-xl border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset to Empty State</span>
            </button>
          </div>

          {/* Load Sample Demo Data */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white mb-1">Load Demo Sample Data</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Pre-populate the dashboard with demo applications (Stanford, MIT, Oxford, etc.) to preview all widgets.
              </p>
            </div>
            <button
              onClick={() => setShowSampleConfirm(true)}
              className="w-full py-2 px-3 rounded-xl border border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Data</span>
            </button>
          </div>

          {/* Export JSON Backup */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white mb-1">Export Data Backup</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Download a JSON backup of your tracked universities, deadlines, and financial records.
              </p>
            </div>
            <button
              onClick={exportDataJSON}
              className="w-full py-2 px-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>

          {/* Export PDF Report */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white mb-1">Export PDF Report</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Generate a print-ready PDF summary of all your applications with statuses, deadlines, and doc progress.
              </p>
            </div>
            <button
              onClick={() => exportToPDF(schools, requirements, settings)}
              className="w-full py-2 px-3 rounded-xl border border-violet-500/30 hover:border-violet-500/60 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          </div>

          {/* Export CSV (Excel) */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white mb-1">Export to Excel / CSV</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Download a clean spreadsheet file compatible with Microsoft Excel, Google Sheets, or Apple Numbers.
              </p>
            </div>
            <button
              onClick={() => exportToCSV(schools, requirements, settings)}
              className="w-full py-2 px-3 rounded-xl border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download CSV File</span>
            </button>
          </div>

          {/* Import JSON Backup */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white mb-1">Restore Backup</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Upload a previously saved GradTrack JSON backup file to restore your applications.
              </p>
            </div>
            <label className="w-full py-2 px-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Backup File</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Author, Ownership & License Section */}
      <div className="glass-panel rounded-3xl p-6 border border-amber-400/20 bg-gradient-to-br from-[#0c1326] via-[#09101f] to-[#070b18] shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Author & Legal Ownership</h2>
              <p className="text-[11px] text-slate-400">Software license and intellectual property notice</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            Personal Use License
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Creator & Author</span>
            <span className="font-extrabold text-white text-sm">Abdul Rahim</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Copyright</span>
            <span className="font-semibold text-slate-200">© 2024–2026 Abdul Rahim</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Usage Rights</span>
            <span className="font-semibold text-amber-300">Personal & Academic Only</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/[0.04]">
          This software, its design, and its codebase are the intellectual property of <strong className="text-white">Abdul Rahim</strong>. 
          You are permitted to freely use, deploy, and self-host this tracker for your personal university application tracking. 
          Redistribution, removal of the author's copyright, re-branding, or commercial sale of this software or its derivatives without explicit written permission is strictly prohibited.
        </p>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearAllData();
          setShowClearConfirm(false);
          alert('All application data has been wiped. Your dashboard is now fresh and empty!');
        }}
        title="Reset to Empty State"
        message="This will clear all tracked universities, requirements, and deadlines so you can start fresh. Are you sure?"
      />

      <ConfirmDialog
        isOpen={showSampleConfirm}
        onClose={() => setShowSampleConfirm(false)}
        onConfirm={() => {
          loadSampleData();
          setShowSampleConfirm(false);
          alert('Demo applications have been loaded into your dashboard!');
        }}
        title="Load Demo Sample Data"
        message="This will load sample demo applications (Stanford, MIT, Oxford, ETH Zurich, Melbourne). Existing data will be replaced. Continue?"
      />
    </div>
  );
};

export default SettingsView;
