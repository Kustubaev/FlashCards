/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/components/notification-toast
 * Description: Toast notification display component
 */

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notificationService.notification(); as notif) {
      <div class="toast" [class]="notif.type" role="alert" aria-live="polite">
        <span class="toast-icon">{{ getIcon(notif.type) }}</span>
        <span class="toast-message">{{ notif.message }}</span>
        <button class="toast-close" (click)="notificationService.clear()" aria-label="Закрыть">&times;</button>
      </div>
    }
  `,
  styleUrl: './notification-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationToastComponent {
  notificationService = inject(NotificationService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '•';
    }
  }
}
