/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/dashboard/bulk-actions-bar
 * Description: Fixed bottom bar for bulk tag operations on selected cards
 */

import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bulk-actions-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bulk-actions-bar.component.html',
  styleUrl: './bulk-actions-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkActionsBarComponent {
  selectedCount = input<number>(0);

  addTag = output<string>();
  removeTag = output<string>();
  clearSelection = output<void>();

  tagInput = signal('');

  onAddTag(): void {
    const tag = this.tagInput().trim();
    if (tag) {
      this.addTag.emit(tag);
      this.tagInput.set('');
    }
  }

  onRemoveTag(): void {
    const tag = this.tagInput().trim();
    if (tag) {
      this.removeTag.emit(tag);
      this.tagInput.set('');
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onAddTag();
    }
  }
}
