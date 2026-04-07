/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/study-free/free-setup
 * Description: Setup screen for free study mode
 */

import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TagRegistryService } from '../tag-manager/tag-registry.service';
import { FreeStudyService } from './free-study.service';
import { getTagCssClass } from '../../app/core/models/tag.model';

@Component({
  selector: 'app-free-setup',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './free-setup.component.html',
  styleUrl: './free-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeSetupComponent {
  #tagRegistry = inject(TagRegistryService);
  #freeStudy = inject(FreeStudyService);
  #router = inject(Router);

  selectedTags = signal<string[]>([]);
  reverseMode = signal(false);
  totalCards = signal(0);

  readonly tags = this.#tagRegistry.tags;

  ngOnInit(): void {
    this.#tagRegistry.refresh();
    this.#updateCount();
  }

  #updateCount(): void {
    const activeTags = this.selectedTags();
    const cards = this.#freeStudy.getStudyCards(activeTags.length > 0 ? activeTags : []);
    this.totalCards.set(this.reverseMode() ? cards.length * 2 : cards.length);
  }

  toggleTag(tagName: string): void {
    this.selectedTags.update((tags) =>
      tags.includes(tagName) ? tags.filter((t) => t !== tagName) : [...tags, tagName],
    );
    this.#updateCount();
  }

  toggleReverse(): void {
    this.reverseMode.update((v) => !v);
    this.#updateCount();
  }

  startSession(): void {
    const activeTags = this.selectedTags();
    const params = new URLSearchParams();
    if (activeTags.length > 0) {
      params.set('tags', activeTags.join(','));
    }
    if (this.reverseMode()) {
      params.set('reverse', '1');
    }
    this.#router.navigate(['/study/free/session'], { queryParams: Object.fromEntries(params) });
  }

  getTagCssClass = getTagCssClass;
}
