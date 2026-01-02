import { Routes } from '@angular/router';

/**
 * Employee Feature Routes
 * 
 * Lazy-loaded routes for the employee feature.
 */
export const employeeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/users.page').then(m => m.UsersPageComponent)
  }
];

