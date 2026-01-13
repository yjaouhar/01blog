import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const auth = inject(AuthService);
  const allowedRoles = route?.data?.['roles'];

  return auth.getMe().pipe(
    map(user => {
      if (!user) {
        return false;
      }

      if (allowedRoles && !allowedRoles.includes(user?.data?.role)) {
        router.navigate(['/forbidden'])
        return false;
      }

      return true;
    }),
    catchError(() => {
      return of(false);
    })
  );
};
