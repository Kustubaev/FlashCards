/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/study-free/free-session
 * Description: Free study session component (same UI as daily but with results)
 */

import { Component, OnInit, signal, computed, inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { StudyCard, AnswerRating } from '../../app/core/models/card.model';
import { StorageService } from '../../app/core/services/storage.service';
import { FreeStudyService } from './free-study.service';
import { FlashcardComponent } from '../../shared/components/flashcard/flashcard.component';
import { StudyControlsComponent } from '../study-daily/study-controls.component';
import { ResultsSummaryComponent } from './results-summary.component';

@Component({
  selector: 'app-free-session',
  standalone: true,
  imports: [CommonModule, RouterLink, FlashcardComponent, StudyControlsComponent, ResultsSummaryComponent],
  templateUrl: './free-session.component.html',
  styleUrl: './free-session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSessionComponent implements OnInit {
  #storage = inject(StorageService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  freeStudy = inject(FreeStudyService);

  #sessionCards = signal<readonly StudyCard[]>([]);
  #currentIndex = signal(0);
  #flipped = signal(false);
  #isComplete = signal(false);

  readonly sessionCards = this.#sessionCards.asReadonly();
  readonly currentIndex = this.#currentIndex.asReadonly();
  readonly flipped = this.#flipped.asReadonly();
  readonly isComplete = this.#isComplete.asReadonly();

  readonly currentCard = computed<StudyCard | null>(() => {
    const cards = this.#sessionCards();
    const index = this.#currentIndex();
    return index < cards.length ? cards[index] : null;
  });

  readonly progress = computed(() => {
    const answered = this.#sessionCards().filter((c) => c.answered).length;
    const total = this.#sessionCards().length;
    return { answered, total };
  });

  readonly frontContent = computed(() => {
    const card = this.currentCard();
    if (!card) return '';
    return card.isReversed ? card.answer : card.question;
  });

  readonly backContent = computed(() => {
    const card = this.currentCard();
    if (!card) return '';
    return card.isReversed ? card.question : card.answer;
  });

  ngOnInit(): void {
    this.#initSession();
  }

  #initSession(): void {
    const tags = this.#route.snapshot.queryParamMap.get('tags');
    const reverse = this.#route.snapshot.queryParamMap.get('reverse') === '1';

    const filterTags = tags ? tags.split(',') : [];
    const cards = this.freeStudy.getStudyCards(filterTags);

    if (cards.length === 0) {
      this.#router.navigate(['/study/free']);
      return;
    }

    let sessionCards = this.freeStudy.prepareSession(cards, reverse);
    sessionCards = this.#shuffle([...sessionCards]);
    this.#sessionCards.set(sessionCards);
  }

  #shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  flip(): void {
    this.#flipped.update((v) => !v);
  }

  onCardFlipped(isFlipped: boolean): void {
    this.#flipped.set(isFlipped);
  }

  rate(rating: AnswerRating): void {
    const card = this.currentCard();
    if (!card) return;

    this.#sessionCards.update((cards) =>
      cards.map((c, i) =>
        i === this.#currentIndex()
          ? { ...c, answered: true, sessionRating: rating }
          : c,
      ),
    );

    this.#flipped.set(false);

    const nextIndex = this.#currentIndex() + 1;
    if (nextIndex >= this.#sessionCards().length) {
      this.#isComplete.set(true);
    } else {
      this.#currentIndex.set(nextIndex);
    }
  }

  exitSession(): void {
    this.#router.navigate(['/']);
  }

  retrySession(): void {
    this.#flipped.set(false);
    this.#currentIndex.set(0);
    this.#isComplete.set(false);
    this.#sessionCards.update((cards) => this.#shuffle([...cards].map((c) => ({ ...c, answered: false, sessionRating: null }))));
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.#isComplete()) return;
    if (event.code === 'Space') {
      event.preventDefault();
      this.flip();
    }
    if (this.#flipped()) {
      switch (event.key) {
        case '1': this.rate('perfect'); break;
        case '2': this.rate('good'); break;
        case '3': this.rate('hard'); break;
        case '4': this.rate('again'); break;
      }
    }
    if (event.code === 'Escape') {
      this.exitSession();
    }
  }
}
