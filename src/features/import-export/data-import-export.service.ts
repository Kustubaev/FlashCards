/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/import-export/data-import-export.service
 * Description: JSON import/export with validation and merge strategy
 */

import { Injectable, inject } from '@angular/core';
import type { FlashCard } from '../../app/core/models/card.model';
import type { Tag } from '../../app/core/models/tag.model';
import { StorageService } from '../../app/core/services/storage.service';
import { toISODateString } from '../../app/core/utils/date.helpers';

export interface ImportResult {
  readonly imported: number;
  readonly updated: number;
  readonly skipped: number;
  readonly errors: readonly string[];
}

interface ExportData {
  readonly version: string;
  readonly exportedAt: string;
  readonly cards: readonly FlashCard[];
  readonly tags: readonly Tag[];
}

@Injectable({ providedIn: 'root' })
export class DataImportExportService {
  #storage = inject(StorageService);

  exportData(): Blob {
    const data: ExportData = {
      version: '2.0',
      exportedAt: toISODateString(new Date()),
      cards: this.#storage.getCards(),
      tags: this.#storage.getTags(),
    };
    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  async importData(file: File): Promise<ImportResult> {
    const text = await file.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return { imported: 0, updated: 0, skipped: 0, errors: ['Неверный формат JSON'] };
    }

    const errors: string[] = [];
    if (!this.#isValidExport(data)) {
      return { imported: 0, updated: 0, skipped: 0, errors: ['Неверная структура данных'] };
    }

    const existingCards = [...this.#storage.getCards()];
    const existingTags = [...this.#storage.getTags()];
    const existingCardMap = new Map(existingCards.map((c) => [c.id, c]));
    const existingTagMap = new Map(existingTags.map((t) => [t.name.toLowerCase(), t]));

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const card of data.cards) {
      if (!this.#isValidCard(card)) {
        errors.push(`Пропущена карточка: неверная структура`);
        skipped++;
        continue;
      }

      if (existingCardMap.has(card.id)) {
        const index = existingCards.findIndex((c) => c.id === card.id);
        existingCards[index] = { ...card };
        updated++;
      } else {
        existingCards.push({ ...card });
        imported++;
      }
    }

    for (const tag of data.tags) {
      const key = tag.name.toLowerCase();
      if (existingTagMap.has(key)) {
        const index = existingTags.findIndex((t) => t.name.toLowerCase() === key);
        existingTags[index] = { ...tag, usageCount: existingTags[index].usageCount };
      } else {
        existingTags.push({ ...tag });
      }
    }

    this.#storage.saveCards(existingCards);
    this.#storage.saveTags(existingTags);

    return { imported, updated, skipped, errors };
  }

  #isValidExport(data: unknown): data is ExportData {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    return Array.isArray(obj['cards']) && Array.isArray(obj['tags']);
  }

  #isValidCard(card: unknown): card is FlashCard {
    if (typeof card !== 'object' || card === null) return false;
    const c = card as Record<string, unknown>;
    return (
      typeof c['id'] === 'string' &&
      typeof c['question'] === 'string' &&
      typeof c['answer'] === 'string' &&
      Array.isArray(c['tags']) &&
      typeof c['step'] === 'number'
    );
  }
}
