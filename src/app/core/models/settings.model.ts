/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/models/settings
 * Description: Application settings model and theme types
 */

/** Application theme mode */
export type Theme = 'light' | 'dark' | 'auto';

/** Sort order for card list */
export type SortMode = 'created-desc' | 'created-asc' | 'alpha-asc' | 'alpha-desc' | 'due-asc';

/**
 * Application settings stored in localStorage
 */
export interface AppSettings {
  /** Current theme */
  readonly theme: Theme;
  /** Default sort mode for card list */
  readonly sortMode: SortMode;
  /** Whether reverse mode is enabled by default */
  readonly defaultReverseMode: boolean;
  /** Maximum number of cards per study session (0 = unlimited) */
  readonly maxSessionCards: number;
  /** Last selected tags for quick access */
  readonly lastSelectedTags: readonly string[];
}

/** Default application settings */
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  sortMode: 'created-desc',
  defaultReverseMode: false,
  maxSessionCards: 0,
  lastSelectedTags: [],
};
