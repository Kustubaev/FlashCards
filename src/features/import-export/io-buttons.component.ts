/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/import-export/io-buttons
 * Description: Export and Import buttons in sidebar
 */

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataImportExportService } from './data-import-export.service';
import { NotificationService } from '../../app/core/services/notification.service';
import { TagRegistryService } from '../tag-manager/tag-registry.service';

@Component({
  selector: 'app-io-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="io-buttons">
      <button class="btn-io" (click)="onExport()" aria-label="Экспорт данных">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        <span>Экспорт</span>
      </button>
      <button class="btn-io" (click)="fileInput.click()" aria-label="Импорт данных">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        <span>Импорт</span>
      </button>
      <input #fileInput type="file" accept=".json" class="hidden-input" (change)="onImport($event)" />
    </div>
  `,
  styleUrl: './io-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IoButtonsComponent {
  #ioService = inject(DataImportExportService);
  #notification = inject(NotificationService);
  #tagRegistry = inject(TagRegistryService);

  onExport(): void {
    const blob = this.#ioService.exportData();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards-pro-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.#notification.showSuccess('Данные экспортированы');
  }

  async onImport(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const result = await this.#ioService.importData(file);

    if (result.errors.length > 0) {
      this.#notification.showError(result.errors[0]);
    } else {
      this.#tagRegistry.refresh();
      this.#notification.showSuccess(`Импортировано: ${result.imported}, обновлено: ${result.updated}`);
    }

    input.value = '';
  }
}
