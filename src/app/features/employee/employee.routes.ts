import { Routes } from '@angular/router';

/**
 * Employee Feature Routes
 *
 * Lazy-loaded routes for the employee feature.
 */
export const employeeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/employee/employee').then(m => m.EmployeePage)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/employee-profile/employee-profile').then(m => m.EmployeeProfile)
  }
];

