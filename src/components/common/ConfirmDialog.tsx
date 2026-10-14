import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#030712]/85 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm bg-[#0b1329] border border-white/10 rounded-2xl shadow-2xl p-6 transform transition-all">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto ${
          variant === 'danger' ? 'bg-red-500/15' : 'bg-amber-500/15'
        }`}>
          {variant === 'danger' ? (
            <Trash2 className="w-6 h-6 text-red-400" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          )}
        </div>
        <h3 className="text-base font-bold text-white text-center mb-2">{title}</h3>
        <p className="text-sm text-slate-400 text-center mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${
              variant === 'danger'
                ? 'bg-red-500/80 hover:bg-red-500 shadow-lg shadow-red-900/30'
                : 'bg-amber-500/80 hover:bg-amber-500 shadow-lg shadow-amber-900/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
