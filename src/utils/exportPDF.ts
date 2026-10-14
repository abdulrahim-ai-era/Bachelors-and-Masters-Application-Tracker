import { School, Requirement, UserSettings } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Accepted: '#10b981',
  Submitted: '#3b82f6',
  Interview: '#8b5cf6',
  'In Progress': '#f59e0b',
  Researching: '#6b7280',
  Rejected: '#ef4444',
  Waitlisted: '#f97316',
  Declined: '#6b7280',
};

const CATEGORY_COLORS: Record<string, string> = {
  Safety: '#10b981',
  Target: '#3b82f6',
  Reach: '#f59e0b',
  Dream: '#ef4444',
};

export function exportToPDF(
  schools: School[],
  requirements: Requirement[],
  settings: UserSettings
) {
  const applicantName = settings.applicantName || 'Applicant';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Group requirements by schoolId for quick lookup
  const reqBySchool: Record<string, Requirement[]> = {};
  requirements.forEach(r => {
    if (!reqBySchool[r.schoolId]) reqBySchool[r.schoolId] = [];
    reqBySchool[r.schoolId].push(r);
  });

  const schoolRows = schools.map(school => {
    const reqs = reqBySchool[school.id] || [];
    const completedReqs = reqs.filter(r => r.status === 'Submitted').length;
    const statusColor = STATUS_COLORS[school.status] || '#6b7280';
    const catColor = school.category ? CATEGORY_COLORS[school.category] || '#6b7280' : '';
    const deadlineDate = school.deadline
      ? new Date(school.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : '—';

    const daysLeft = school.deadline
      ? Math.ceil((new Date(school.deadline).getTime() - Date.now()) / 86400000)
      : null;
    const daysLabel = daysLeft === null
      ? ''
      : daysLeft < 0
      ? `<span style="color:#ef4444;font-size:10px;">(Overdue)</span>`
      : daysLeft <= 7
      ? `<span style="color:#ef4444;font-size:10px;">(${daysLeft}d left)</span>`
      : daysLeft <= 14
      ? `<span style="color:#f59e0b;font-size:10px;">(${daysLeft}d left)</span>`
      : daysLeft <= 30
      ? `<span style="color:#22c55e;font-size:10px;">(${daysLeft}d left)</span>`
      : '';

    return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:10px 12px;">
          <div style="font-weight:700;font-size:12px;color:#111827;">${school.name}</div>
          <div style="font-size:10px;color:#6b7280;margin-top:2px;">${school.degreeType} · ${school.program}</div>
          ${school.category ? `<span style="display:inline-block;margin-top:4px;padding:1px 7px;border-radius:20px;font-size:9px;font-weight:700;color:#fff;background:${catColor};">${school.category}</span>` : ''}
        </td>
        <td style="padding:10px 12px;font-size:11px;color:#374151;">${school.country}</td>
        <td style="padding:10px 12px;">
          <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;color:#fff;background:${statusColor};">
            ${school.status}
          </span>
        </td>
        <td style="padding:10px 12px;font-size:11px;color:#374151;">
          ${deadlineDate} ${daysLabel}
        </td>
        <td style="padding:10px 12px;font-size:11px;color:#374151;">
          ${completedReqs}/${reqs.length} docs
        </td>
      </tr>
    `;
  }).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>GradTrack — ${applicantName}'s Application Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111827; padding: 40px; }
    .header { margin-bottom: 28px; border-bottom: 3px solid #f59e0b; padding-bottom: 16px; }
    .header h1 { font-size: 22px; font-weight: 900; color: #111827; }
    .header .sub { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .meta { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
    .meta-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 18px; min-width: 120px; }
    .meta-card .val { font-size: 20px; font-weight: 900; color: #111827; }
    .meta-card .label { font-size: 10px; color: #9ca3af; margin-top: 2px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    h2 { font-size: 14px; font-weight: 800; color: #111827; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    thead tr { background: #f3f4f6; }
    thead th { padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; }
    tbody tr:hover { background: #fafafa; }
    .footer { margin-top: 32px; font-size: 10px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 14px; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 GradTrack — Application Summary Report</h1>
    <div class="sub">Prepared for: <strong>${applicantName}</strong> &nbsp;·&nbsp; Generated: ${today} &nbsp;·&nbsp; Target: ${settings.targetIntake || 'N/A'}</div>
  </div>

  <div class="meta">
    <div class="meta-card">
      <div class="val">${schools.length}</div>
      <div class="label">Total Schools</div>
    </div>
    <div class="meta-card">
      <div class="val" style="color:#3b82f6;">${schools.filter(s => ['Submitted','Interview','Accepted','Waitlisted'].includes(s.status)).length}</div>
      <div class="label">Submitted</div>
    </div>
    <div class="meta-card">
      <div class="val" style="color:#10b981;">${schools.filter(s => s.status === 'Accepted').length}</div>
      <div class="label">Offers</div>
    </div>
    <div class="meta-card">
      <div class="val" style="color:#f59e0b;">${new Set(schools.map(s => s.country)).size}</div>
      <div class="label">Countries</div>
    </div>
  </div>

  <h2>All Applications</h2>
  <table>
    <thead>
      <tr>
        <th>University / Program</th>
        <th>Country</th>
        <th>Status</th>
        <th>Deadline</th>
        <th>Docs Ready</th>
      </tr>
    </thead>
    <tbody>
      ${schools.length > 0 ? schoolRows : '<tr><td colspan="5" style="padding:20px;text-align:center;color:#9ca3af;">No applications added yet.</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    GradTrack · Application Tracker · Report generated ${today}
  </div>

  <script>window.print();<\/script>
</body>
</html>
  `;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Pop-up blocked. Please allow pop-ups for this site and try again.');
    return;
  }
  win.document.write(html);
  win.document.close();
}

