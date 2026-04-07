/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/utils/date.helpers
 * Description: Date utility functions for spaced repetition
 */

import type { ISODateString } from '../models/card.model';

/**
 * Add days to a date and return ISO date string
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Convert a Date to ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): ISODateString {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a card is due for review
 */
export function isDue(nextReviewDate: ISODateString | null, now: Date = new Date()): boolean {
  if (!nextReviewDate) return true;
  const today = toISODateString(now);
  return nextReviewDate <= today;
}

/**
 * Get relative date string in Russian
 */
export function getRelativeDateString(date: ISODateString, now: Date = new Date()): string {
  const today = toISODateString(now);
  const tomorrow = toISODateString(addDays(now, 1));
  const yesterday = toISODateString(addDays(now, -1));

  if (date === today) return 'Сегодня';
  if (date === tomorrow) return 'Завтра';
  if (date === yesterday) return 'Вчера';

  const targetDate = new Date(date + 'T00:00:00');
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0 && diffDays <= 7) {
    return `Через ${getDaysWord(diffDays)}`;
  }
  if (diffDays < 0 && diffDays >= -7) {
    return `${getDaysWord(Math.abs(diffDays))} назад`;
  }

  return date;
}

/**
 * Get correct Russian word form for days
 */
function getDaysWord(n: number): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;

  if (abs > 10 && abs < 20) return `${n} дней`;
  if (lastDigit === 1) return `${n} день`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${n} дня`;
  return `${n} дней`;
}
