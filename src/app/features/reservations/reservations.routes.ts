import { Routes } from '@angular/router';

/**
 * Reservations Feature Routes
 * 
 * Lazy-loaded routes for the reservations feature.
 */
export const reservationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/reservations.page').then(m => m.ReservationsPage)
  }
];

