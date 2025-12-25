import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

    const authService = inject(AuthService);
    const router = inject(Router);



    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
        return next(req);
    }

    const token = authService.accessToken();
    let authReq = req;

    console.log("add token : ", token);
    if (token) {

        authReq = addToken(req, token);
    }

    return next(authReq).pipe(
        catchError(error => {
            if (error.status === 401 && !req.url.includes('/auth/refresh')) {
                return handle401(authReq, next, authService, router);
            }
            return throwError(() => error);
        })
    );
};

function addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
}

function handle401(
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: AuthService,
    router: Router
): Observable<HttpEvent<any>> {

    if (!isRefreshing) {
        isRefreshing = true;
        refreshSubject.next(null);
        return authService.refreshToken().pipe(
            switchMap(res => {
                isRefreshing = false;
                authService.setAccessToken(res.accessToken);
                refreshSubject.next(res.accessToken);
                return next(addToken(req, res.accessToken));
            }),
            catchError(err => {
                isRefreshing = false;
                authService.logout();
                console.log("interceptorre errrroror : ", err.error);
                router.navigate(['/login']);

                return throwError(() => err);
            })
        );
    }
    return refreshSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next(addToken(req, token!)))
    );
}
