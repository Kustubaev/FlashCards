/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/models/tag
 * Description: Tag data models and color shade utilities
 */

import type { UUID } from './card.model';

/**
 * Shade levels for tag colors (6 opacity levels of accent color)
 */
export type TagShade = 100 | 200 | 300 | 400 | 500 | 600;

/**
 * A tag in the global registry
 */
export interface Tag {
  /** Unique identifier */
  readonly id: UUID;
  /** Tag name (unique, case-insensitive) */
  readonly name: string;
  /** How many cards use this tag */
  readonly usageCount: number;
  /** Whether the tag is currently active in filters */
  readonly isActive: boolean;
}

/**
 * Suggestion item for tag autocomplete
 */
export interface TagSuggestion {
  readonly name: string;
  readonly usageCount: number;
}

/**
 * Accent color for all tags (single color with 6 opacity shades)
 */
export const TAG_ACCENT_COLOR = '#6366f1';

/**
 * Shade definitions: opacity levels for the accent color
 */
export const TAG_SHADES: Record<TagShade, number> = {
  100: 0.12,
  200: 0.24,
  300: 0.40,
  400: 0.60,
  500: 0.80,
  600: 1.0,
};

/**
 * Get the CSS class name for a given shade level
 */
export function getTagShadeClass(shade: TagShade): string {
  return `tag-shade-${shade}`;
}

/**
 * Get the CSS class for a tag based on its usage count
 * Higher usage = more prominent shade
 */
export function getTagCssClass(usageCount: number): string {
  if (usageCount >= 20) return getTagShadeClass(600);
  if (usageCount >= 10) return getTagShadeClass(500);
  if (usageCount >= 5) return getTagShadeClass(400);
  if (usageCount >= 3) return getTagShadeClass(300);
  if (usageCount >= 1) return getTagShadeClass(200);
  return getTagShadeClass(100);
}
