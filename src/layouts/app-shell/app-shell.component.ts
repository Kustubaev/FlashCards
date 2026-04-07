/**
 * FlashCards Pro - Angular 19 Application
 * Module: layouts/app-shell
 * Description: Main application shell with sidebar, navbar, and router outlet
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { NotificationToastComponent } from '../../shared/components/notification-toast/notification-toast.component';
import { LABELS } from '../../app/core/config/constants';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ThemeToggleComponent,
    NotificationToastComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  labels = LABELS;
}
