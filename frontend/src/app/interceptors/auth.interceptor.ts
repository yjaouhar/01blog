import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);


    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
        return next(req);
    }

    const authReq = req.clone({ withCredentials: true });

    return next(authReq).pipe(
        catchError(error => {
            let message = "";
            if (error?.error?.errors?.length > 0) {
                message = error?.error?.errors[0]?.message
            }

            if (error.status === 401 && !req.url.includes('/auth/refresh') && message !== "Invalid token") {
           

                return authService.refreshToken().pipe(
                    switchMap(() => {
                        const retryReq = req.clone({ withCredentials: true });
                        return next(retryReq);
                    }),
                    catchError(err => {
                        if (err?.status === 401 || err?.status === 403 || err?.status === 400) {
                            router.navigate(['/login']);
                        }
                        return throwError(() => err); error?.error?.errors
                    })
                );
            } 
            return throwError(() => error);
        })
    );
};
