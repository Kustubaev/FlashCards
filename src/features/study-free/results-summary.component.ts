/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/study-free/results-summary
 * Description: End-of-session results display
 */

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SessionResults {
  readonly total: number;
  readonly correct: number;
  readonly incorrect: number;
  readonly correctPercent: number;
}

@Component({
  selector: 'app-results-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-summary.component.html',
  styleUrl: './results-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsSummaryComponent {
  results = input.required<SessionResults>();
  retry = output<void>();
  changeFilters = output<void>();
}
