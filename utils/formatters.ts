// Utility functions for formatting dates and currency

/**
 * Get current date in UTC+7 (Vietnam timezone)
 */
export function getVietnamNow(): Date {
  const now = new Date();
  // Convert to UTC+7 (Vietnam timezone)
  const vietnamOffset = 7 * 60; // 7 hours in minutes
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + vietnamOffset * 60000);
}

/**
 * Get date in UTC+7 (Vietnam timezone)
 */
function getVietnamDate(date: string | Date): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Convert to UTC+7 (Vietnam timezone)
  const vietnamOffset = 7 * 60; // 7 hours in minutes
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + vietnamOffset * 60000);
}

/**
 * Format date to Vietnamese format: dd-mm-yyyy (UTC+7)
 */
export function formatDate(date: string | Date): string {
  const d = getVietnamDate(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Format currency to Vietnamese Dong (₫)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format currency without symbol (for display)
 */
export function formatCurrencyNumber(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

/**
 * Get today's date in YYYY-MM-DD format (UTC+7)
 */
export function getTodayDate(): string {
  const today = getVietnamDate(new Date());
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date range for filtering (last 7 days, 30 days, etc.) in UTC+7
 */
export function getDateRange(days: number): { start: string; end: string } {
  const end = getVietnamDate(new Date());
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    start: formatDateString(start),
    end: formatDateString(end),
  };
}

