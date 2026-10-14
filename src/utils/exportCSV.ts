import { School, Requirement, UserSettings } from '../types';

export function exportToCSV(
  schools: School[],
  requirements: Requirement[],
  settings: UserSettings
) {
  if (schools.length === 0) {
    alert('No applications to export.');
    return;
  }

  // Pre-calculate docs ready count per school
  const docsMap: Record<string, { done: number; total: number }> = {};
  requirements.forEach(r => {
    if (!docsMap[r.schoolId]) docsMap[r.schoolId] = { done: 0, total: 0 };
    docsMap[r.schoolId].total++;
    if (r.status === 'Submitted') docsMap[r.schoolId].done++;
  });

  const headers = [
    'University',
    'Program',
    'Degree Type',
    'Category',
    'Country',
    'Application Status',
    'Deadline',
    'Application Fee',
    'Documents Ready',
    'Portal URL',
    'Notes',
  ];

  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = schools.map(s => {
    const docInfo = docsMap[s.id] || { done: 0, total: 0 };
    const docStr = `${docInfo.done}/${docInfo.total} Completed`;
    return [
      escapeCSV(s.name),
      escapeCSV(s.program),
      escapeCSV(s.degreeType),
      escapeCSV(s.category || 'Uncategorized'),
      escapeCSV(s.country),
      escapeCSV(s.status),
      escapeCSV(s.deadline),
      escapeCSV(`${settings.currency || '$'}${s.applicationFee || 0}`),
      escapeCSV(docStr),
      escapeCSV(s.portalUrl || ''),
      escapeCSV(s.notes || ''),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanName = (settings.applicantName || 'Applications').replace(/[^a-zA-Z0-9]/g, '_');
  a.download = `GradTrack_${cleanName}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
