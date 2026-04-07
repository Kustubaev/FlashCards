/**
 * FlashCards Pro - Angular 19 Application
 * Module: app/app
 * Description: Root component with router outlet
 */

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  #theme = inject(ThemeService);
}
