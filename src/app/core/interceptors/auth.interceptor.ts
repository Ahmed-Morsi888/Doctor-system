/**
 * Auth Interceptor
 *
 * Example HTTP interceptor for adding authentication tokens to requests
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Example: Add auth token to requests
  // const authService = inject(AuthService);
  // const token = authService.getToken();

  // if (token) {
  //   req = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  // }

  return next(req);
};

