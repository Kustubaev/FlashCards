/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/components/markdown-renderer
 * Description: Component that renders Markdown + LaTeX content
 */

import { Component, input, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderContent } from '../../../app/core/utils/markdown-renderer.util';

@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  template: `<div class="markdown-body" [innerHTML]="rendered()"></div>`,
  styles: [`
    :host { display: block; }
    .markdown-body {
      line-height: 1.6;
      word-wrap: break-word;
    }
    .markdown-body :deep(p) { margin: 0.5em 0; }
    .markdown-body :deep(code) {
      background: var(--bg-code, #f3f4f6);
      padding: 0.125em 0.375em;
      border-radius: 0.25rem;
      font-size: 0.875em;
    }
    .markdown-body :deep(pre) {
      background: var(--bg-pre, #1e293b);
      color: var(--text-on-dark, #e2e8f0);
      padding: 1rem;
      border-radius: var(--radius-md, 0.5rem);
      overflow-x: auto;
    }
    .markdown-body :deep(pre code) {
      background: transparent;
      padding: 0;
      color: inherit;
    }
    .markdown-body :deep(blockquote) {
      border-left: 3px solid var(--accent, #6366f1);
      padding-left: 1rem;
      margin: 0.5em 0;
      color: var(--text-muted, #6b7280);
    }
    .markdown-body :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: var(--radius-md, 0.5rem);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownRendererComponent {
  #sanitizer = inject(DomSanitizer);

  content = input.required<string>();

  rendered = computed<SafeHtml>(() => renderContent(this.content(), this.#sanitizer));
}
