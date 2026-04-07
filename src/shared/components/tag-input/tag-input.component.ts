/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/components/tag-input
 * Description: Tag input with autocomplete dropdown and pill management
 */

import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import type { TagSuggestion } from '../../../app/core/models/tag.model';
import { getTagCssClass } from '../../../app/core/models/tag.model';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './tag-input.component.html',
  styleUrl: './tag-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagInputComponent {
  model = input.required<string[]>();
  modelChange = output<string[]>();
  placeholder = input<string>('Введите тег и нажмите Enter');
  suggestions = input<readonly TagSuggestion[]>([]);

  inputValue = signal('');
  showDropdown = signal(false);

  filteredSuggestions = computed(() => {
    const query = this.inputValue().toLowerCase().trim();
    const currentTags = this.model().map((t) => t.toLowerCase());
    if (!query) return [];
    return this.suggestions().filter(
      (s) =>
        s.name.toLowerCase().includes(query) &&
        !currentTags.includes(s.name.toLowerCase()),
    );
  });

  addTag(tag: string): void {
    const trimmed = tag.trim();
    if (!trimmed) return;

    const current = this.model();
    const exists = current.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) return;

    const updated = [...current, trimmed];
    this.modelChange.emit(updated);
    this.inputValue.set('');
    this.showDropdown.set(false);
  }

  removeTag(tag: string): void {
    const updated = this.model().filter((t) => t !== tag);
    this.modelChange.emit(updated);
  }

  selectSuggestion(suggestion: TagSuggestion): void {
    this.addTag(suggestion.name);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag(this.inputValue());
    } else if (event.key === 'Backspace' && !this.inputValue()) {
      const current = this.model();
      if (current.length > 0) {
        this.removeTag(current[current.length - 1]);
      }
    }
  }

  onInputFocus(): void {
    if (this.filteredSuggestions().length > 0) {
      this.showDropdown.set(true);
    }
  }

  onInputChange(): void {
    this.showDropdown.set(this.filteredSuggestions().length > 0);
  }

  onOutsideClick(): void {
    this.showDropdown.set(false);
  }

  getTagCssClass = getTagCssClass;
}
