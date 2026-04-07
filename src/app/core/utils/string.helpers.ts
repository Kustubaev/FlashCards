/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/utils/string.helpers
 * Description: String manipulation utilities
 */

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Highlight search term in text with <mark> tags
 */
export function highlightText(text: string, term: string): string {
  if (!term.trim()) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
  return escaped.replace(regex, '<mark>$1</mark>');
}

/**
 * Strip Markdown syntax to get plain text
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`#]/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '[формула]')
    .replace(/\$[^$]+\$/g, '[формула]')
    .trim();
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
