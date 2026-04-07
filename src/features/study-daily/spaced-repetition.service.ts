/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/study-daily/spaced-repetition.service
 * Description: Ebbinghaus spaced repetition algorithm implementation
 */

import { Injectable, inject } from '@angular/core';
import type { FlashCard, StudyCard, AnswerRating, CardStatus } from '../../app/core/models/card.model';
import { REVIEW_INTERVALS } from '../../app/core/models/card.model';
import { StorageService } from '../../app/core/services/storage.service';
import { addDays, toISODateString, isDue } from '../../app/core/utils/date.helpers';

@Injectable({ providedIn: 'root' })
export class SpacedRepetitionService {
  #storage = inject(StorageService);

  /**
   * Get current status of a card
   */
  getCardStatus(card: FlashCard, now: Date = new Date()): CardStatus {
    if (!card.nextReviewDate) return 'new';
    if (card.step >= 5) return 'learned';
    if (isDue(card.nextReviewDate, now)) return 'due';
    return 'learning';
  }

  /**
   * Get all cards that are due for review
   */
  getDueCards(filterTags: readonly string[] = []): readonly FlashCard[] {
    const cards = this.#storage.getCards();
    const now = new Date();

    let due = cards.filter((c) => isDue(c.nextReviewDate, now));

    if (filterTags.length > 0) {
      due = due.filter((c) => c.tags.some((t) => filterTags.includes(t)));
    }

    return due.sort((a, b) => {
      if (!a.nextReviewDate && !b.nextReviewDate) return 0;
      if (!a.nextReviewDate) return -1;
      if (!b.nextReviewDate) return 1;
      return a.nextReviewDate.localeCompare(b.nextReviewDate);
    });
  }

  /**
   * Process an answer and return updated card (immutable)
   */
  processAnswer(card: FlashCard, rating: AnswerRating, now: Date = new Date()): FlashCard {
    let newStep = card.step;
    let nextReviewDate: string | null = null;

    switch (rating) {
      case 'again':
        newStep = 0;
        nextReviewDate = toISODateString(now);
        break;
      case 'hard':
        newStep = Math.max(0, card.step);
        nextReviewDate = toISODateString(addDays(now, REVIEW_INTERVALS[newStep] ?? 1));
        break;
      case 'good':
        newStep = Math.min(card.step + 1, REVIEW_INTERVALS.length - 1);
        nextReviewDate = toISODateString(addDays(now, REVIEW_INTERVALS[newStep]));
        break;
      case 'perfect':
        newStep = Math.min(card.step + 2, REVIEW_INTERVALS.length - 1);
        nextReviewDate = toISODateString(addDays(now, REVIEW_INTERVALS[newStep]));
        break;
    }

    return {
      ...card,
      step: newStep,
      nextReviewDate,
      updatedAt: toISODateString(now),
    };
  }

  /**
   * Expand cards with reverse mode (question <-> answer)
   */
  expandWithReverse(cards: readonly FlashCard[]): readonly StudyCard[] {
    const result: StudyCard[] = [];

    for (const card of cards) {
      result.push({
        ...card,
        isReversed: false,
        answered: false,
        sessionRating: null,
      });

      result.push({
        ...card,
        isReversed: true,
        answered: false,
        sessionRating: null,
      });
    }

    return result;
  }

  /**
   * Update streak counter
   */
  updateStreak(): void {
    const streak = this.#storage.getStreak();
    const today = toISODateString(new Date());

    if (streak.lastDate === today) return;

    if (streak.lastDate) {
      const lastDate = new Date(streak.lastDate + 'T00:00:00');
      const diffDays = Math.round(
        (new Date(today + 'T00:00:00').getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        streak.current += 1;
      } else if (diffDays > 1) {
        streak.current = 1;
      }
    } else {
      streak.current = 1;
    }

    streak.lastDate = today;
    this.#storage.saveStreak(streak);
  }
}
