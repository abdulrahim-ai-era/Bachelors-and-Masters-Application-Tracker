import React from 'react';
import { ApplicationStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  size?: 'xs' | 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; border: string; glow: string; label?: string }> = {
  // Matched to image screenshot
  'Offer Received': {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
  },
  'Under Review': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
  },
  'Applied': {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]',
  },
  // Application statuses mapped to UI labels
  Accepted: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    label: 'Offer Received',
  },
  'In Progress': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    label: 'Under Review',
  },
  Submitted: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]',
    label: 'Applied',
  },
  Researching: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    glow: '',
    label: 'Researching',
  },
  Interview: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.25)]',
  },
  Rejected: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    glow: '',
  },
  Waitlisted: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    glow: '',
  },
  Declined: {
    bg: 'bg-slate-500/15',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    glow: '',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = statusConfig[status] || {
    bg: 'bg-slate-500/15',
    text: 'text-slate-300',
    border: 'border-slate-500/30',
    glow: '',
  };

  const displayText = config.label || status;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${config.glow} ${sizeClasses} whitespace-nowrap transition-all duration-200`}
    >
      {displayText}
    </span>
  );
};
