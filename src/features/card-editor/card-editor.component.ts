/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/card-editor/card-editor
 * Description: Modal card editor with form, tag input, and live preview
 */

import { Component, input, output, signal, computed, inject, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { FlashCard } from '../../app/core/models/card.model';
import { UuidService } from '../../app/core/services/uuid.service';
import { StorageService } from '../../app/core/services/storage.service';
import { TagRegistryService } from '../tag-manager/tag-registry.service';
import { TagInputComponent } from '../../shared/components/tag-input/tag-input.component';
import { FlashcardComponent } from '../../shared/components/flashcard/flashcard.component';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { toISODateString } from '../../app/core/utils/date.helpers';
import type { TagSuggestion } from '../../app/core/models/tag.model';

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TagInputComponent,
    FlashcardComponent,
  ],
  templateUrl: './card-editor.component.html',
  styleUrl: './card-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardEditorComponent implements OnInit {
  #uuid = inject(UuidService);
  #storage = inject(StorageService);
  #tagRegistry = inject(TagRegistryService);

  card = input<FlashCard | null>(null);

  cardSaved = output<FlashCard>();
  cancelled = output<void>();

  question = signal('');
  answer = signal('');
  tags = signal<string[]>([]);

  showPreview = signal(false);
  activeTab = signal<'edit' | 'preview'>('edit');
  previewFlipped = signal(false);

  readonly suggestions = computed<TagSuggestion[]>(() =>
    this.#tagRegistry.tags().map((t) => ({ name: t.name, usageCount: t.usageCount })),
  );

  readonly isEdit = computed(() => this.card() !== null);
  readonly modalTitle = computed(() => this.isEdit() ? 'Редактировать карточку' : 'Новая карточка');

  readonly isValid = computed(() =>
    this.question().trim().length > 0 && this.answer().trim().length > 0,
  );

  ngOnInit(): void {
    const existing = this.card();
    if (existing) {
      this.question.set(existing.question);
      this.answer.set(existing.answer);
      this.tags.set([...existing.tags]);
    }
  }

  onSave(): void {
    if (!this.isValid()) return;

    const existing = this.card();
    const now = toISODateString(new Date());

    const cardData: FlashCard = existing
      ? {
          ...existing,
          question: this.question().trim(),
          answer: this.answer().trim(),
          tags: [...this.tags()],
          updatedAt: now,
        }
      : {
          id: this.#uuid.generate(),
          question: this.question().trim(),
          answer: this.answer().trim(),
          tags: [...this.tags()],
          step: 0,
          nextReviewDate: null,
          createdAt: now,
          updatedAt: now,
        };

    this.#storage.updateCards((cards) => {
      const index = existing ? cards.findIndex((c) => c.id === existing.id) : -1;
      if (index >= 0) {
        return [...cards.slice(0, index), cardData, ...cards.slice(index + 1)];
      }
      return [...cards, cardData];
    });

    for (const tag of this.tags()) {
      this.#tagRegistry.registerTag(tag);
    }

    this.cardSaved.emit(cardData);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  insertImage(target: 'question' | 'answer'): void {
    const url = prompt('Введите URL изображения:');
    if (!url) return;
    const alt = prompt('Описание (alt):') || 'image';
    const markdown = `![${alt}](${url})`;
    const signalToUpdate = target === 'question' ? this.question : this.answer;
    signalToUpdate.update((val) => val + (val ? '\n' : '') + markdown);
  }

  onTagsChange(newTags: string[]): void {
    this.tags.set(newTags);
  }

  togglePreview(): void {
    this.activeTab.update((t) => (t === 'edit' ? 'preview' : 'edit'));
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel();
  }
}
