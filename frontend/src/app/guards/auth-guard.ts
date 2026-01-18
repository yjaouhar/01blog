import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, throwError } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const auth = inject(AuthService);
  const allowedRoles = route?.data?.['roles'];

  return auth.getMe().pipe(
    map(user => {
      if (!user) {
        return false;
      }
      if (state.url === '/login' || state.url === '/register') {
        router.navigate(['/']);
      }
      if (allowedRoles && !allowedRoles.includes(user?.data?.role)) {
        router.navigate(['/forbidden'])
        return false;
      }

      return true;
    }),
    catchError(error => {
      if (state.url === '/login' || state.url === '/register') {
        return of(true);
      }      
      if (error.status === 401) {
        router.navigate(['/login']);
        return throwError(() => error);
      } else if (error.status === 403) {
        router.navigate(['/forbidden']);
        return throwError(() => error);
      } else if (error.status === 404) {
        router.navigate(['/not-found']);
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};
