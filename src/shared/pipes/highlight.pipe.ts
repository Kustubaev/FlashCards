/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/pipes/highlight
 * Description: Highlight search term in text with <mark> tags
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { escapeHtml, highlightText } from '../../app/core/utils/string.helpers';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, term: string): SafeHtml {
    if (!text) return this.sanitizer.bypassSecurityTrustHtml('');
    const html = highlightText(text, term);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
