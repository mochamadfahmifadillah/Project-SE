/*
|--------------------------------------------------------------------------
| Formatters
|--------------------------------------------------------------------------
|
| Reusable formatting helpers for the frontend.
|
*/

/**
 * Format number using Indonesian locale.
 *
 * Example:
 * formatNumber(1248) → "1.248"
 */
export function formatNumber(value, fallback = "0") {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return new Intl.NumberFormat("id-ID").format(number);
}

/**
 * Format currency to Indonesian Rupiah.
 *
 * Example:
 * formatCurrency(150000) → "Rp150.000"
 */
export function formatCurrency(value, fallback = "Rp0") {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Format rating value.
 *
 * Example:
 * formatRating(4.567) → "4.6"
 */
export function formatRating(value, fallback = "0.0") {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return number.toFixed(1);
}

/**
 * Format date using Indonesian locale.
 *
 * Example:
 * formatDate("2026-08-26")
 * → "26 Agu 2026"
 */
export function formatDate(
  value,
  fallback = "—",
) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Format date and time.
 *
 * Example:
 * formatDateTime("2026-08-26T10:30:00")
 * → "26 Agu 2026, 10.30"
 */
export function formatDateTime(
  value,
  fallback = "—",
) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Convert text to title case.
 *
 * Example:
 * formatTitle("software management")
 * → "Software Management"
 */
export function formatTitle(value, fallback = "") {
  if (!value) {
    return fallback;
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Format percentage.
 *
 * Example:
 * formatPercentage(12.5) → "12.5%"
 */
export function formatPercentage(
  value,
  fallback = "0%",
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return `${number}%`;
}

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  formatNumber,
  formatCurrency,
  formatRating,
  formatDate,
  formatDateTime,
  formatTitle,
  formatPercentage,
};
