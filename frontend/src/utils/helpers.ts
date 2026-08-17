/**
 * Format an ISO date string into a human-readable format.
 * Example: "2024-05-10T00:00:00" -> "May 10, 2024"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Format an ISO date-time string into a human-readable format with time.
 * Example: "2024-05-10T10:30:00" -> "May 10, 2024, 10:30 AM"
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}

/**
 * Map backend status values to user-friendly display labels.
 * Confirmed -> Active, Completed -> Completed, Cancelled -> Cancelled
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'Confirmed':
      return 'Active';
    case 'Completed':
      return 'Completed';
    case 'Cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

/**
 * Get CSS class modifier for a given status.
 */
export function getStatusClass(status: string): string {
  switch (status) {
    case 'Confirmed':
      return 'active';
    case 'Completed':
      return 'completed';
    case 'Cancelled':
      return 'cancelled';
    default:
      return '';
  }
}

/**
 * Simple email validation.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
