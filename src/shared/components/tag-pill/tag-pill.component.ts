/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/components/tag-pill
 * Description: Small read-only tag display component
 */

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { getTagCssClass } from '../../../app/core/models/tag.model';

@Component({
  selector: 'app-tag-pill',
  standalone: true,
  template: `
    <span class="tag-pill" [class]="getTagCssClass(usageCount())">
      {{ name() }}
    </span>
  `,
  styleUrl: './tag-pill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagPillComponent {
  name = input.required<string>();
  usageCount = input<number>(0);

  getTagCssClass = getTagCssClass;
}
