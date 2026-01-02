import { Routes } from '@angular/router';

/**
 * Reservations Feature Routes
 *
 * Lazy-loaded routes for the reservations feature.
 */
export const reservationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/reservation.page').then((m) => m.ReservationPage),
  },
];
