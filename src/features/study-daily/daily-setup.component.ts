/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/study-daily/daily-setup
 * Description: Pre-session setup screen - select tags, reverse mode, start
 */

import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TagRegistryService } from '../tag-manager/tag-registry.service';
import { SpacedRepetitionService } from './spaced-repetition.service';
import { getTagCssClass } from '../../app/core/models/tag.model';

@Component({
  selector: 'app-daily-setup',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './daily-setup.component.html',
  styleUrl: './daily-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailySetupComponent {
  #tagRegistry = inject(TagRegistryService);
  #spacedRepetition = inject(SpacedRepetitionService);
  #router = inject(Router);

  selectedTags = signal<string[]>([]);
  reverseMode = signal(false);

  readonly dueCount = signal(0);
  readonly tags = this.#tagRegistry.tags;

  ngOnInit(): void {
    this.#tagRegistry.refresh();
    this.#updateDueCount();
  }

  #updateDueCount(): void {
    const activeTags = this.selectedTags();
    const due = this.#spacedRepetition.getDueCards(activeTags.length > 0 ? activeTags : []);
    const count = this.reverseMode() ? due.length * 2 : due.length;
    this.dueCount.set(count);
  }

  toggleTag(tagName: string): void {
    this.selectedTags.update((tags) =>
      tags.includes(tagName) ? tags.filter((t) => t !== tagName) : [...tags, tagName],
    );
    this.#updateDueCount();
  }

  toggleReverse(): void {
    this.reverseMode.update((v) => !v);
    this.#updateDueCount();
  }

  startSession(): void {
    const activeTags = this.selectedTags();
    const due = this.#spacedRepetition.getDueCards(activeTags.length > 0 ? activeTags : []);
    if (due.length === 0) return;

    const params = new URLSearchParams();
    if (activeTags.length > 0) {
      params.set('tags', activeTags.join(','));
    }
    if (this.reverseMode()) {
      params.set('reverse', '1');
    }
    this.#router.navigate(['/study/daily/session'], { queryParams: Object.fromEntries(params) });
  }

  getTagCssClass = getTagCssClass;
}
