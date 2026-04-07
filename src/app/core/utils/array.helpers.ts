/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/utils/array.helpers
 * Description: Array utility functions
 */

/**
 * Return unique values from array
 */
export function unique<T>(arr: readonly T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Sort strings using locale-aware comparison (Russian support)
 */
export function sortByLocale(arr: readonly string[], locale: string = 'ru-RU'): string[] {
  return [...arr].sort((a, b) => a.localeCompare(b, locale));
}

/**
 * Toggle item in array: add if not present, remove if present
 */
export function toggleInArray<T>(arr: readonly T[], item: T): T[] {
  const index = arr.indexOf(item);
  if (index === -1) {
    return [...arr, item];
  }
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
