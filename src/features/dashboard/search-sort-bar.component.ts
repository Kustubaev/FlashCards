/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/dashboard/search-sort-bar
 * Description: Search input, sort selector, and add card button
 */

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { SortMode } from '../../app/core/models/settings.model';

@Component({
  selector: 'app-search-sort-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-sort-bar.component.html',
  styleUrl: './search-sort-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSortBarComponent {
  searchQuery = input<string>('');
  sortMode = input<SortMode>('created-desc');

  searchChange = output<string>();
  sortChange = output<SortMode>();
  addCard = output<void>();

  sortOptions: { value: SortMode; label: string }[] = [
    { value: 'created-desc', label: 'Сначала новые' },
    { value: 'created-asc', label: 'Сначала старые' },
    { value: 'alpha-asc', label: 'По алфавиту (А-Я)' },
    { value: 'alpha-desc', label: 'По алфавиту (Я-А)' },
    { value: 'due-asc', label: 'По дате повторения' },
  ];

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortMode;
    this.sortChange.emit(value);
  }
}
