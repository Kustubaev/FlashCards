/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/dashboard/dashboard
 * Description: Main dashboard container with card grid, search, filters, and stats
 */

import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FlashCard } from '../../app/core/models/card.model';
import type { SortMode } from '../../app/core/models/settings.model';
import { StorageService } from '../../app/core/services/storage.service';
import { NotificationService } from '../../app/core/services/notification.service';
import { TagRegistryService } from '../tag-manager/tag-registry.service';
import { SelectionService } from './selection.service';
import { StatsWidgetComponent, DashboardStats } from './stats-widget.component';
import { SearchSortBarComponent } from './search-sort-bar.component';
import { CardItemComponent } from './card-item.component';
import { BulkActionsBarComponent } from './bulk-actions-bar.component';
import { TagFilterSidebarComponent } from '../tag-manager/tag-filter-sidebar.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CardEditorComponent } from '../card-editor/card-editor.component';
import { IoButtonsComponent } from '../import-export/io-buttons.component';
import { isDue } from '../../app/core/utils/date.helpers';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsWidgetComponent,
    SearchSortBarComponent,
    CardItemComponent,
    BulkActionsBarComponent,
    TagFilterSidebarComponent,
    ConfirmDialogComponent,
    CardEditorComponent,
    IoButtonsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  #storage = inject(StorageService);
  #notification = inject(NotificationService);
  #tagRegistry = inject(TagRegistryService);
  #selection = inject(SelectionService);

  selectionService = this.#selection;

  #cards = signal<readonly FlashCard[]>([]);
  #searchQuery = signal('');
  #sortMode = signal<SortMode>('created-desc');
  #showEditor = signal(false);
  #editingCard = signal<FlashCard | null>(null);
  #deleteTarget = signal<FlashCard | null>(null);
  #showDeleteDialog = signal(false);

  readonly cards = this.#cards.asReadonly();
  readonly searchQuery = this.#searchQuery.asReadonly();
  readonly sortMode = this.#sortMode.asReadonly();
  readonly showEditor = this.#showEditor.asReadonly();
  readonly editingCard = this.#editingCard.asReadonly();
  readonly showDeleteDialog = this.#showDeleteDialog.asReadonly();
  readonly selectedCount = this.#selection.selectedCount;

  readonly filteredCards = computed(() => {
    let result = [...this.#cards()];
    const query = this.#searchQuery().toLowerCase().trim();
    const activeTags = this.#tagRegistry.getActiveTags();

    if (query) {
      result = result.filter(
        (c) =>
          c.question.toLowerCase().includes(query) ||
          c.answer.toLowerCase().includes(query) ||
          c.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }

    if (activeTags.length > 0) {
      result = result.filter((c) =>
        c.tags.some((t) => activeTags.includes(t)),
      );
    }

    const sort = this.#sortMode();
    switch (sort) {
      case 'created-desc':
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'created-asc':
        result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case 'alpha-asc':
        result.sort((a, b) => a.question.localeCompare(b.question, 'ru-RU'));
        break;
      case 'alpha-desc':
        result.sort((a, b) => b.question.localeCompare(a.question, 'ru-RU'));
        break;
      case 'due-asc':
        result.sort((a, b) => {
          const aDate = a.nextReviewDate || '9999-12-31';
          const bDate = b.nextReviewDate || '9999-12-31';
          return aDate.localeCompare(bDate);
        });
        break;
    }

    return result;
  });

  readonly stats = computed<DashboardStats>(() => {
    const all = this.#cards();
    const now = new Date();
    return {
      total: all.length,
      learned: all.filter((c) => c.step >= 5).length,
      due: all.filter((c) => isDue(c.nextReviewDate, now)).length,
      streak: this.#storage.getStreak().current,
    };
  });

  ngOnInit(): void {
    this.#loadCards();
    this.#tagRegistry.refresh();
  }

  #loadCards(): void {
    this.#cards.set(this.#storage.getCards());
  }

  onSearchChange(query: string): void {
    this.#searchQuery.set(query);
  }

  onSortChange(mode: SortMode): void {
    this.#sortMode.set(mode);
    const settings = this.#storage.getSettings();
    this.#storage.saveSettings({ ...settings, sortMode: mode });
  }

  onAddCard(): void {
    this.#editingCard.set(null);
    this.#showEditor.set(true);
  }

  onEditCard(card: FlashCard): void {
    this.#editingCard.set(card);
    this.#showEditor.set(true);
  }

  onDeleteRequest(card: FlashCard): void {
    this.#deleteTarget.set(card);
    this.#showDeleteDialog.set(true);
  }

  onConfirmDelete(): void {
    const target = this.#deleteTarget();
    if (!target) return;

    this.#storage.updateCards((cards) => cards.filter((c) => c.id !== target.id));
    this.#cards.set(this.#storage.getCards());
    this.#tagRegistry.refresh();
    this.#selection.clear();
    this.#showDeleteDialog.set(false);
    this.#deleteTarget.set(null);
    this.#notification.showSuccess('Карточка удалена');
  }

  onCancelDelete(): void {
    this.#showDeleteDialog.set(false);
    this.#deleteTarget.set(null);
  }

  onCardSelected(id: string, selected: boolean): void {
    this.#selection.toggle(id);
  }

  onBulkAddTag(tag: string): void {
    const selectedIds = this.#selection.selectedIds();
    if (selectedIds.size === 0) return;

    this.#storage.updateCards((cards) =>
      cards.map((c) =>
        selectedIds.has(c.id) && !c.tags.includes(tag)
          ? { ...c, tags: [...c.tags, tag] }
          : c,
      ),
    );
    this.#cards.set(this.#storage.getCards());
    this.#tagRegistry.refresh();
    this.#notification.showSuccess(`Тег "${tag}" добавлен к ${selectedIds.size} карточкам`);
  }

  onBulkRemoveTag(tag: string): void {
    const selectedIds = this.#selection.selectedIds();
    if (selectedIds.size === 0) return;

    this.#storage.updateCards((cards) =>
      cards.map((c) =>
        selectedIds.has(c.id)
          ? { ...c, tags: c.tags.filter((t) => t !== tag) }
          : c,
      ),
    );
    this.#cards.set(this.#storage.getCards());
    this.#tagRegistry.refresh();
    this.#selection.clear();
    this.#notification.showSuccess(`Тег "${tag}" удалён из ${selectedIds.size} карточек`);
  }

  onClearSelection(): void {
    this.#selection.clear();
  }

  onEditorSave(card: FlashCard): void {
    this.#showEditor.set(false);
    this.#editingCard.set(null);
    this.#loadCards();
    this.#tagRegistry.refresh();
  }

  onEditorCancel(): void {
    this.#showEditor.set(false);
    this.#editingCard.set(null);
  }
}
