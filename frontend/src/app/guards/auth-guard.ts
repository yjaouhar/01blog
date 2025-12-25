import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route?.data['roles'];
  return auth.getMe().pipe(
    map(user => {
      if (allowedRoles && !allowedRoles.includes(user?.data)) {
        return false;
      }
      return true;
    }),
    catchError(err => {
      console.log("==> * error in catch Guard : ", err);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
