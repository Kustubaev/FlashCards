/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/tag-manager/tag-registry.service
 * Description: Global tag registry with usage tracking
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import type { Tag, TagSuggestion } from '../../app/core/models/tag.model';
import { StorageService } from '../../app/core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class TagRegistryService {
  #storage = inject(StorageService);
  #tags = signal<readonly Tag[]>([]);

  readonly tags = this.#tags.asReadonly();

  /**
   * Load tags from storage and refresh usage counts from cards
   */
  refresh(): void {
    const storedTags = this.#storage.getTags();
    const cards = this.#storage.getCards();

    const usageMap = new Map<string, number>();
    for (const card of cards) {
      for (const tag of card.tags) {
        const lower = tag.toLowerCase();
        usageMap.set(lower, (usageMap.get(lower) || 0) + 1);
      }
    }

    const refreshed: Tag[] = storedTags.map((tag) => ({
      ...tag,
      usageCount: usageMap.get(tag.name.toLowerCase()) || tag.usageCount,
    }));

    this.#tags.set(refreshed);
  }

  /**
   * Get filtered tag suggestions for autocomplete
   */
  getSuggestions(query: string, exclude: readonly string[] = []): TagSuggestion[] {
    const lowerQuery = query.toLowerCase();
    const lowerExclude = exclude.map((e) => e.toLowerCase());

    return this.#tags()
      .filter(
        (tag) =>
          tag.name.toLowerCase().includes(lowerQuery) &&
          !lowerExclude.includes(tag.name.toLowerCase()),
      )
      .map((tag) => ({
        name: tag.name,
        usageCount: tag.usageCount,
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);
  }

  /**
   * Register a new tag if it doesn't exist
   */
  registerTag(name: string): void {
    const current = [...this.#tags()];
    const exists = current.some((t) => t.name.toLowerCase() === name.toLowerCase());
    if (exists) return;

    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      usageCount: 0,
      isActive: false,
    };
    current.push(newTag);
    this.#tags.set(current);
    this.#storage.saveTags(current);
  }

  /**
   * Toggle tag active state for filtering
   */
  toggleTagActive(tagName: string): void {
    this.#tags.update((tags) =>
      tags.map((tag) =>
        tag.name === tagName ? { ...tag, isActive: !tag.isActive } : tag,
      ),
    );
    this.#storage.saveTags(this.#tags());
  }

  /**
   * Get all active tag names
   */
  getActiveTags(): string[] {
    return this.#tags()
      .filter((t) => t.isActive)
      .map((t) => t.name);
  }
}
