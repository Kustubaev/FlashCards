/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/dashboard/stats-widget
 * Description: Statistics display widget (total, learned, due, streak)
 */

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardStats {
  readonly total: number;
  readonly learned: number;
  readonly due: number;
  readonly streak: number;
}

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-widget.component.html',
  styleUrl: './stats-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsWidgetComponent {
  stats = input.required<DashboardStats>();
}
