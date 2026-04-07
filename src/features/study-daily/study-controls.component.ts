/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/study-daily/study-controls
 * Description: Rating buttons for answering during study session
 */

import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import type { AnswerRating } from '../../app/core/models/card.model';

@Component({
  selector: 'app-study-controls',
  standalone: true,
  template: `
    <div class="study-controls">
      <button class="btn-rating btn-perfect" (click)="rate.emit('perfect')" aria-label="Идеально">
        <span class="rating-icon">✨</span>
        <span class="rating-label">Идеально</span>
        <span class="rating-key">1</span>
      </button>
      <button class="btn-rating btn-good" (click)="rate.emit('good')" aria-label="Хорошо">
        <span class="rating-icon">👍</span>
        <span class="rating-label">Хорошо</span>
        <span class="rating-key">2</span>
      </button>
      <button class="btn-rating btn-hard" (click)="rate.emit('hard')" aria-label="Сложно">
        <span class="rating-icon">😅</span>
        <span class="rating-label">Сложно</span>
        <span class="rating-key">3</span>
      </button>
      <button class="btn-rating btn-again" (click)="rate.emit('again')" aria-label="Снова">
        <span class="rating-icon">🔄</span>
        <span class="rating-label">Снова</span>
        <span class="rating-key">4</span>
      </button>
    </div>
  `,
  styleUrl: './study-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyControlsComponent {
  rate = output<AnswerRating>();
}
