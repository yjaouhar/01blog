import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {


  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route?.data['roles'];
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }
  return auth.getMe().pipe(
    map(user => {
      if (allowedRoles && !allowedRoles.includes(user?.data)) {
        return false;
      }
      return true;
    }),
    catchError(err => {
      console.log("==> * error in catch Guard : ", err);
      return throwError(() => err);
    })
  );
};