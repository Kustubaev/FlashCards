/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/components/flashcard
 * Description: 3D flip flashcard component with question/answer display
 */

import { Component, ViewEncapsulation, input, output, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderContent } from '../../../app/core/utils/markdown-renderer.util';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FlashcardComponent {
  #sanitizer = inject(DomSanitizer);

  frontContent = input.required<string>();
  backContent = input.required<string>();
  frontLabel = input<string>('Вопрос');
  backLabel = input<string>('Ответ');
  isFlipped = input<boolean>(false);

  flipped = output<boolean>();

  readonly renderedFront = computed<SafeHtml>(() =>
    renderContent(this.frontContent(), this.#sanitizer),
  );

  readonly renderedBack = computed<SafeHtml>(() =>
    renderContent(this.backContent(), this.#sanitizer),
  );
}
