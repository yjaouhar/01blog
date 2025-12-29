// auth.resolver.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { ResolveFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, of, map, EMPTY } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route?.data?.['roles'];
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  console.log('🔍 [RESOLVER] Starting auth check...');

  return auth.getMe().pipe(
    map(user => {
      const userRole = user?.data;
      console.log('✅ [RESOLVER] User:', userRole);

      if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log('❌ [RESOLVER] Wrong role - redirecting');
        // router.navigate(['/login']);
        return null; // Return null to indicate failed resolution
      }

      console.log('✅ [RESOLVER] Auth successful');
      return user;
    }),
    catchError(err => {
      console.log('❌ [RESOLVER] Auth failed:', err.status);
      console.log('🔄 [RESOLVER] Redirecting to login');
      router.navigate(['/login'])

      return EMPTY;
    })
  );
};