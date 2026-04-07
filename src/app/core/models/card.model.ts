/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/models/card
 * Description: Core card data models and types
 */

/** Unique identifier for entities */
export type UUID = string;

/** ISO 8601 date string (YYYY-MM-DD) */
export type ISODateString = string;

/** Rating given by user when answering a card */
export type AnswerRating = 'perfect' | 'good' | 'hard' | 'again';

/** Current status of a card in the learning process */
export type CardStatus = 'new' | 'learning' | 'learned' | 'due';

/**
 * A single flashcard with question and answer
 */
export interface FlashCard {
  /** Unique identifier */
  readonly id: UUID;
  /** Question text (supports Markdown + LaTeX) */
  readonly question: string;
  /** Answer text (supports Markdown + LaTeX) */
  readonly answer: string;
  /** Array of tag names */
  readonly tags: readonly string[];
  /** Current step in the spaced repetition algorithm (0-5) */
  readonly step: number;
  /** Next scheduled review date (ISO string) */
  readonly nextReviewDate: ISODateString | null;
  /** Date the card was created */
  readonly createdAt: ISODateString;
  /** Date the card was last modified */
  readonly updatedAt: ISODateString;
}

/**
 * A study card used during a study session
 * Extends FlashCard with session-specific data
 */
export interface StudyCard extends FlashCard {
  /** Whether this card is in reverse mode (answer as question) */
  readonly isReversed: boolean;
  /** Whether the card has been answered in this session */
  readonly answered: boolean;
  /** The rating given during this session */
  readonly sessionRating: AnswerRating | null;
}

/** Intervals in days for the spaced repetition algorithm */
export const REVIEW_INTERVALS: readonly number[] = [0.5, 1, 2, 4, 7, 15, 30, 60, 120];
