/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/config/constants
 * Description: Storage keys and application constants
 */

/** localStorage keys */
export const STORAGE_KEYS = {
  CARDS: 'fc_cards_v2',
  TAGS: 'fc_tags_v2',
  SETTINGS: 'fc_settings_v2',
  STREAK: 'fc_streak_v2',
} as const;

/** Keyboard shortcuts */
export const KEYBOARD_SHORTCUTS = {
  FLIP: 'Space',
  RATE_PERFECT: 'ArrowRight',
  RATE_GOOD: 'ArrowDown',
  RATE_HARD: 'ArrowLeft',
  RATE_AGAIN: 'ArrowUp',
  EXIT: 'Escape',
} as const;

/** UI labels */
export const LABELS = {
  APP_NAME: 'FlashCards Pro',
  DASHBOARD: 'Доска',
  STUDY_DAILY: 'На сегодня',
  STUDY_FREE: 'Свободно',
  QUESTION: 'Вопрос',
  ANSWER: 'Ответ',
  ADD_CARD: 'Добавить карточку',
  EDIT_CARD: 'Редактировать карточку',
  DELETE_CARD: 'Удалить карточку',
  SAVE: 'Сохранить',
  CANCEL: 'Отмена',
  DELETE: 'Удалить',
  CONFIRM_DELETE: 'Вы уверены, что хотите удалить эту карточку?',
  NO_CARDS: 'Нет карточек. Создайте первую!',
  NO_DUE_CARDS: 'Нет карточек для повторения на сегодня!',
  START_SESSION: 'Начать',
  SESSION_COMPLETE: 'Сессия завершена!',
  EXPORT: 'Экспорт',
  IMPORT: 'Импорт',
  SEARCH: 'Поиск...',
  TAGS: 'Теги',
  STATS: 'Статистика',
  SETTINGS: 'Настройки',
} as const;
