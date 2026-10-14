import { Requirement } from '../types';

export function formatCurrency(amount: number | undefined | null, currency: string = '$'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currency}0`;
  return `${currency}${Number(amount).toLocaleString('en-US')}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDaysUntilDeadline(dateString: string): {
  days: number;
  isUrgent: boolean; // < 7 days
  isUpcoming: boolean; // < 30 days
  isOverdue: boolean;
  label: string;
} {
  if (!dateString) {
    return { days: 0, isUrgent: false, isUpcoming: false, isOverdue: false, label: 'No deadline' };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateString.split('-');
  let targetDate = new Date();
  if (parts.length === 3) {
    targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    targetDate = new Date(dateString);
  }
  targetDate.setHours(0, 0, 0, 0);

  const diffMs = targetDate.getTime() - today.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const isOverdue = days < 0;
  const isUrgent = days >= 0 && days <= 7;
  const isUpcoming = days >= 0 && days <= 30;

  let label = '';
  if (isOverdue) {
    label = `${Math.abs(days)}d ago`;
  } else if (days === 0) {
    label = 'Today!';
  } else if (days === 1) {
    label = 'Tomorrow';
  } else {
    label = `${days} days left`;
  }

  return { days, isUrgent, isUpcoming, isOverdue, label };
}

export function getCountryFlag(countryCode: string): string {
  const code = (countryCode || '').toUpperCase();
  const flags: Record<string, string> = {
    US: '🇺🇸',
    USA: '🇺🇸',
    GB: '🇬🇧',
    UK: '🇬🇧',
    CH: '🇨🇭',
    AU: '🇦🇺',
    CA: '🇨🇦',
    DE: '🇩🇪',
    SG: '🇸🇬',
    SE: '🇸🇪',
    NL: '🇳🇱',
    FR: '🇫🇷',
    JP: '🇯🇵',
    KR: '🇰🇷',
    NZ: '🇳🇿',
    IN: '🇮🇳',
    PK: '🇵🇰',
    AE: '🇦🇪',
  };
  return flags[code] || '🌐';
}

export function calculateSchoolProgress(requirements: Requirement[], schoolId: string): {
  total: number;
  submitted: number;
  percentage: number;
} {
  const schoolReqs = requirements.filter(r => r.schoolId === schoolId);
  if (schoolReqs.length === 0) {
    return { total: 0, submitted: 0, percentage: 0 };
  }
  const submitted = schoolReqs.filter(r => r.status === 'Submitted').length;
  const percentage = Math.round((submitted / schoolReqs.length) * 100);
  return { total: schoolReqs.length, submitted, percentage };
}

export function calculateNetCost(tuition: number = 0, livingCost: number = 0, funding: number = 0): number {
  return (tuition || 0) + (livingCost || 0) - (funding || 0);
}

export function calculateNetValue(tuition: number = 0, livingCost: number = 0, funding: number = 0): number {
  return (funding || 0) - ((tuition || 0) + (livingCost || 0));
}

export function getRecommenderInactivity(lastContactedDate: string): {
  daysSince: number;
  isInactive: boolean; // >= 14 days
} {
  if (!lastContactedDate) return { daysSince: 999, isInactive: true };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = lastContactedDate.split('-');
  let contactedDate = new Date();
  if (parts.length === 3) {
    contactedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    contactedDate = new Date(lastContactedDate);
  }
  contactedDate.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - contactedDate.getTime();
  const daysSince = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  return {
    daysSince,
    isInactive: daysSince >= 14,
  };
}
