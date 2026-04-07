/**
 * FlashCards Pro - Angular 19 Application
 * Module: features/tag-manager/tag-filter-sidebar
 * Description: Left sidebar with tag list, counts, and checkboxes for filtering
 */

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagRegistryService } from './tag-registry.service';
import { getTagCssClass } from '../../app/core/models/tag.model';

@Component({
  selector: 'app-tag-filter-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-filter-sidebar.component.html',
  styleUrl: './tag-filter-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagFilterSidebarComponent {
  tagRegistry = inject(TagRegistryService);

  getTagCssClass = getTagCssClass;

  toggleTag(tagName: string): void {
    this.tagRegistry.toggleTagActive(tagName);
  }
}
