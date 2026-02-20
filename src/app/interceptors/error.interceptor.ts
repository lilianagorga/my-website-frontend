import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigateByUrl('/login');
      } else if (error.status === 403) {
        console.warn('Access forbidden (403):', error.url);
      } else if (error.status === 0) {
        console.error('Network error:', error);
      }

      return throwError(() => error);
    })
  );
};
