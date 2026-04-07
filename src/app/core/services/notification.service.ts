/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/services/notification
 * Description: Toast notification system with signal-based state
 */

import { Injectable, signal } from '@angular/core';
import { timer } from 'rxjs';

export interface NotificationData {
  readonly message: string;
  readonly type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  #notification = signal<NotificationData | null>(null);
  readonly notification = this.#notification.asReadonly();

  #autoDismissTimer: ReturnType<typeof setTimeout> | null = null;

  showSuccess(message: string): void {
    this.#show(message, 'success');
  }

  showError(message: string): void {
    this.#show(message, 'error');
  }

  showInfo(message: string): void {
    this.#show(message, 'info');
  }

  clear(): void {
    this.#notification.set(null);
    if (this.#autoDismissTimer) {
      clearTimeout(this.#autoDismissTimer);
      this.#autoDismissTimer = null;
    }
  }

  #show(message: string, type: NotificationData['type']): void {
    this.clear();
    this.#notification.set({ message, type });
    this.#autoDismissTimer = setTimeout(() => {
      this.#notification.set(null);
      this.#autoDismissTimer = null;
    }, 3000);
  }
}
