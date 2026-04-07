/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/study-daily/daily-session
 * Description: Active study session with flashcard and rating controls
 */

import { Component, OnInit, signal, computed, inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { FlashCard, StudyCard, AnswerRating } from '../../app/core/models/card.model';
import { StorageService } from '../../app/core/services/storage.service';
import { NotificationService } from '../../app/core/services/notification.service';
import { SpacedRepetitionService } from './spaced-repetition.service';
import { FlashcardComponent } from '../../shared/components/flashcard/flashcard.component';
import { StudyControlsComponent } from './study-controls.component';

@Component({
  selector: 'app-daily-session',
  standalone: true,
  imports: [CommonModule, RouterLink, FlashcardComponent, StudyControlsComponent],
  templateUrl: './daily-session.component.html',
  styleUrl: './daily-session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailySessionComponent implements OnInit {
  #storage = inject(StorageService);
  #notification = inject(NotificationService);
  #spacedRepetition = inject(SpacedRepetitionService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

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
    const dueCards = this.#spacedRepetition.getDueCards(filterTags);

    if (dueCards.length === 0) {
      this.#notification.showInfo('Нет карточек для повторения');
      this.#router.navigate(['/']);
      return;
    }

    let sessionCards: StudyCard[] = reverse
      ? [...this.#spacedRepetition.expandWithReverse(dueCards)]
      : dueCards.map((c) => ({ ...c, isReversed: false, answered: false, sessionRating: null }));

    sessionCards = this.#shuffle(sessionCards);
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

    const updatedCard = this.#spacedRepetition.processAnswer(card, rating);

    this.#storage.updateCards((cards) =>
      cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)),
    );

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
      this.#spacedRepetition.updateStreak();
    } else {
      this.#currentIndex.set(nextIndex);
    }
  }

  exitSession(): void {
    this.#router.navigate(['/']);
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
        case '1':
          this.rate('perfect');
          break;
        case '2':
          this.rate('good');
          break;
        case '3':
          this.rate('hard');
          break;
        case '4':
          this.rate('again');
          break;
      }
    }

    if (event.code === 'Escape') {
      this.exitSession();
    }
  }
}
