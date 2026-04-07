/**
 * FlashCards Pro - Angular 19 Application
 * Module: layouts/study-layout
 * Description: Fullscreen layout for study sessions
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-study-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styleUrl: './study-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyLayoutComponent {}
