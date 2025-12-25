import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'];
  console.log("role in guard : ", allowedRoles);
  return auth.getMe().pipe(
    map(user => {
      console.log("user in guard : ", user.data);
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log("user dont have match role for this route", user.data);
        // router.navigate(['/login']);
        return false;
      }
      console.log("role is valid : ", user.data);
      return true;
    }),
    catchError(err => {
      console.log("==> * error in catch Guard : ", err);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
