/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/components/confirm-dialog
 * Description: Reusable confirmation dialog modal
 */

import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  title = input<string>('Подтверждение');
  message = input.required<string>();
  confirmText = input<string>('Подтвердить');
  cancelText = input<string>('Отмена');
  isOpen = input<boolean>(false);

  confirmed = output<void>();
  cancelled = output<void>();

  cancel(): void {
    this.cancelled.emit();
  }

  confirm(): void {
    this.confirmed.emit();
  }
}
