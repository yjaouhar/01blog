import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, map, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);


    if (req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh')) {
        return next(req);
    }
    const authReq = req.clone({ withCredentials: true });;
    return next(authReq).pipe(
        catchError(error => {

            let message = "";
            if (error?.error?.errors?.length > 0) {
                message = error?.error?.errors[0]?.message
            }
            if (error.status === 401) {
                router.navigate(['/login']);
                return throwError(() => error);
            } else if (error.status === 403) {
                router.navigate(['/forbidden']);
                return throwError(() => error);
            } else if (error.status !== 401) {
                return throwError(() => error);
            }
            return authService.refreshToken().pipe(
                switchMap(() => {
                    const retryReq = authReq.clone({ withCredentials: true });
                    return next(retryReq);
                }),
                catchError(err => {
                    router.navigate(['/login']);
                    return throwError(() => err);
                })
            );
        })
    );
};
