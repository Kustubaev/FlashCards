/**
 * FlashCards Pro - Angular 19 Application
 * Module: app.routes
 * Description: Application routing configuration
 */

import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../layouts/app-shell/app-shell.component')
      .then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('../features/dashboard/dashboard.component')
          .then((m) => m.DashboardComponent),
      },
    ],
  },
  {
    path: 'study/daily',
    loadComponent: () => import('../features/study-daily/daily-setup.component')
      .then((m) => m.DailySetupComponent),
  },
  {
    path: 'study/daily/session',
    loadComponent: () => import('../features/study-daily/daily-session.component')
      .then((m) => m.DailySessionComponent),
  },
  {
    path: 'study/free',
    loadComponent: () => import('../features/study-free/free-setup.component')
      .then((m) => m.FreeSetupComponent),
  },
  {
    path: 'study/free/session',
    loadComponent: () => import('../features/study-free/free-session.component')
      .then((m) => m.FreeSessionComponent),
  },
  { path: '**', redirectTo: '' },
];
