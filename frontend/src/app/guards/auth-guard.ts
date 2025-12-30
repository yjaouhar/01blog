import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, makeStateKey, PLATFORM_ID, REQUEST, TransferState } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, map, NEVER, of } from 'rxjs';
const AUTH_STATE_KEY = makeStateKey<boolean>('auth_state');

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    console.log("======= 1 ", router.url);

    return true;
  }
  const auth = inject(AuthService);
  const allowedRoles = route?.data?.['roles'];
  console.log("======= 2");
  return auth.getMe().pipe(
    map(user => {
      console.log("valid");

      if (allowedRoles && !allowedRoles.includes(user?.data)) {
        return false;
      }
      return true;
    }),
    catchError(err => {
      console.log("==> * error in catch Guard : ", err);
      // return throwError(() => err);
      router.navigate(['/login']);
      return NEVER;
    })
  );
};
