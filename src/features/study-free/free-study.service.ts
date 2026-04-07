/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/study-free/free-study.service
 * Description: Logic for free study mode (no algorithm restrictions)
 */

import { Injectable, inject } from '@angular/core';
import type { FlashCard, StudyCard, AnswerRating } from '../../app/core/models/card.model';
import { StorageService } from '../../app/core/services/storage.service';
import { SpacedRepetitionService } from '../study-daily/spaced-repetition.service';

@Injectable({ providedIn: 'root' })
export class FreeStudyService {
  #storage = inject(StorageService);
  #spacedRepetition = inject(SpacedRepetitionService);

  /**
   * Get all cards for free study, optionally filtered by tags
   */
  getStudyCards(filterTags: readonly string[] = []): readonly FlashCard[] {
    const cards = this.#storage.getCards();
    if (filterTags.length === 0) return cards;
    return cards.filter((c) => c.tags.some((t) => filterTags.includes(t)));
  }

  /**
   * Prepare study cards with optional reverse mode
   */
  prepareSession(cards: readonly FlashCard[], reverse: boolean): readonly StudyCard[] {
    if (reverse) {
      return this.#spacedRepetition.expandWithReverse(cards);
    }
    return cards.map((c) => ({
      ...c,
      isReversed: false,
      answered: false,
      sessionRating: null,
    }));
  }

  /**
   * Calculate session results
   */
  calculateResults(cards: readonly StudyCard[]): {
    total: number;
    correct: number;
    incorrect: number;
    correctPercent: number;
  } {
    const answered = cards.filter((c) => c.answered);
    const correct = answered.filter(
      (c) => c.sessionRating === 'perfect' || c.sessionRating === 'good',
    ).length;
    const incorrect = answered.length - correct;
    const total = answered.length;

    return {
      total,
      correct,
      incorrect,
      correctPercent: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }
}
