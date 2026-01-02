/**
 * Auth Guard
 * 
 * Example route guard for protecting routes that require authentication
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Example: Check if user is authenticated
  // const authService = inject(AuthService);
  // const isAuthenticated = authService.isAuthenticated();
  
  // if (!isAuthenticated) {
  //   router.navigate(['/login']);
  //   return false;
  // }
  
  return true;
};

