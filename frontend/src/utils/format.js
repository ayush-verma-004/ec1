/* ─── Currency ─────────────────────────────────────────────────────────── */
/**
 * Format a value as Indian Rupees with 2 decimal places.
 * e.g. 123456.78 → "₹1,23,456.78"
 */
export const fmtCurrency = (val) => {
  if (val == null || isNaN(val)) return '₹—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

/**
 * Compact currency — no decimals, with suffix for large nums.
 * e.g. 1200000 → "₹12L"
 */
export const fmtCurrencyCompact = (val) => {
  if (val == null || isNaN(val)) return '₹—';
  if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(1)}Cr`;
  if (val >= 100_000)    return `₹${(val / 100_000).toFixed(1)}L`;
  if (val >= 1_000)      return `₹${(val / 1_000).toFixed(1)}K`;
  return `₹${val}`;
};

/* ─── CO₂ / Carbon Amount ─────────────────────────────────────────────── */
/**
 * Format CO₂ amount with 2 decimal places and "Tons" suffix.
 * e.g. 284560 → "2,84,560.00 Tons"
 */
export const fmtCO2 = (val) => {
  if (val == null || isNaN(val)) return '— Tons';
  return `${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val)} Tons`;
};

/* ─── Date & Time ──────────────────────────────────────────────────────── */
/**
 * Format an ISO string or Date as "14 Apr 2026, 10:45 AM"
 */
export const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (isNaN(d)) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).replace(',', '');
};

/**
 * Format a date-only ISO string as "14 Apr 2026"
 */
export const fmtDateShort = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso; // fallback — return raw
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Human-relative date: "Today", "Yesterday", "3 days ago", "2 months ago"
 */
export const relativeDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs  = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffH   = Math.floor(diffMin / 60);
  const diffD   = Math.floor(diffH / 24);
  const diffM   = Math.floor(diffD / 30);

  if (diffSec < 60)  return 'Just now';
  if (diffMin < 60)  return `${diffMin}m ago`;
  if (diffH < 24)    return `${diffH}h ago`;
  if (diffD === 1)   return 'Yesterday';
  if (diffD < 30)    return `${diffD} days ago`;
  if (diffM === 1)   return '1 month ago';
  if (diffM < 12)    return `${diffM} months ago`;
  return fmtDateShort(iso);
};

/* ─── Number Formatting ────────────────────────────────────────────────── */
/**
 * Format a plain number with Indian locale commas.
 * e.g. 284560 → "2,84,560"
 */
export const fmtNumber = (val) => {
  if (val == null || isNaN(val)) return '—';
  return new Intl.NumberFormat('en-IN').format(val);
};

/**
 * Truncate a long string (IDs, hashes) for display.
 * e.g. "LND-001-MUMBAI-..." → "LND-001-MUM…"
 */
export const truncateId = (str, maxLen = 16) => {
  if (!str) return '—';
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
};
