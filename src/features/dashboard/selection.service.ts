/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/dashboard/selection.service
 * Description: Manage selected card IDs for bulk operations
 */

import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  #selectedIds = signal<ReadonlySet<string>>(new Set());

  readonly selectedIds = this.#selectedIds.asReadonly();
  readonly selectedCount = computed(() => this.#selectedIds().size);
  readonly hasSelection = computed(() => this.#selectedIds().size > 0);

  toggle(id: string): void {
    this.#selectedIds.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  selectAll(ids: readonly string[]): void {
    this.#selectedIds.set(new Set(ids));
  }

  clear(): void {
    this.#selectedIds.set(new Set());
  }

  isSelected(id: string): boolean {
    return this.#selectedIds().has(id);
  }
}
