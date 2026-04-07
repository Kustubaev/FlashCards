/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/components/theme-toggle
 * Description: Button to toggle between light and dark themes
 */

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../../app/core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      class="theme-btn"
      (click)="themeService.toggle()"
      [attr.aria-label]="themeService.appliedTheme() === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
    >
      @if (themeService.appliedTheme() === 'dark') {
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      } @else {
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      }
    </button>
  `,
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
