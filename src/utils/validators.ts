export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  const parts = dateString.split('-');
  if (parts.length !== 3) return false;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  return true;
}

export function isPositiveNumber(value: number | string): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0;
}
