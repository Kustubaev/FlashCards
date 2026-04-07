/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/services/theme
 * Description: Signal-based theme management with system preference detection
 */

import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Theme } from '../models/settings.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  #storage = inject(StorageService);
  #platformId = inject(PLATFORM_ID);

  #theme = signal<Theme>('auto');
  #systemPrefersDark = signal<boolean>(false);

  readonly theme = this.#theme.asReadonly();

  readonly appliedTheme = computed<'light' | 'dark'>(() => {
    const current = this.#theme();
    if (current === 'auto') {
      return this.#systemPrefersDark() ? 'dark' : 'light';
    }
    return current;
  });

  constructor() {
    this.#init();
  }

  #init(): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    const settings = this.#storage.getSettings();
    this.#theme.set(settings.theme);

    this.#detectSystemPreference();

    effect(() => {
      this.#applyToDOM(this.appliedTheme());
    });
  }

  #detectSystemPreference(): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    this.#systemPrefersDark.set(mq.matches);

    mq.addEventListener('change', (e) => {
      this.#systemPrefersDark.set(e.matches);
    });
  }

  #applyToDOM(theme: 'light' | 'dark'): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    document.documentElement.setAttribute('data-theme', theme);
  }

  setTheme(theme: Theme): void {
    this.#theme.set(theme);
    this.#storage.saveSettings({ ...this.#storage.getSettings(), theme });
  }

  toggle(): void {
    const current = this.#theme();
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }
}
