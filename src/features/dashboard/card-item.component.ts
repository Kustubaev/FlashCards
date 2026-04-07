/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/dashboard/card-item
 * Description: Single card display in the grid with tags, status, and actions
 */

import { Component, input, output, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { FlashCard, CardStatus } from '../../app/core/models/card.model';
import { TagPillComponent } from '../../shared/components/tag-pill/tag-pill.component';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { stripMarkdown } from '../../app/core/utils/string.helpers';
import { renderContent } from '../../app/core/utils/markdown-renderer.util';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule, TagPillComponent, RelativeDatePipe],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardItemComponent {
  #sanitizer = inject(DomSanitizer);

  card = input.required<FlashCard>();
  isSelected = input<boolean>(false);
  searchQuery = input<string>('');

  selected = output<boolean>();
  edit = output<FlashCard>();
  delete = output<FlashCard>();

  answerRevealed = signal(false);

  readonly particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    delay: `${Math.random() * 2}s`,
  }));

  readonly renderedQuestion = computed<SafeHtml>(() =>
    renderContent(this.card().question, this.#sanitizer),
  );

  readonly renderedAnswer = computed<SafeHtml>(() =>
    renderContent(this.card().answer, this.#sanitizer),
  );

  toggleSelection(): void {
    this.selected.emit(!this.isSelected());
  }

  getStatusClass(card: FlashCard): string {
    if (!card.nextReviewDate) return 'status-new';
    const now = new Date();
    const reviewDate = new Date(card.nextReviewDate + 'T00:00:00');
    if (reviewDate <= now) return 'status-due';
    if (card.step >= 5) return 'status-learned';
    return 'status-learning';
  }

  getStatusLabel(card: FlashCard): string {
    if (!card.nextReviewDate) return 'Новая';
    const now = new Date();
    const reviewDate = new Date(card.nextReviewDate + 'T00:00:00');
    if (reviewDate <= now) return 'К повторению';
    if (card.step >= 5) return 'Изучена';
    return 'Изучается';
  }

  getPreview(text: string, maxLen: number): string {
    const plain = stripMarkdown(text);
    return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain;
  }
}
