import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshSubject = new BehaviorSubject<string | null>(null);

    authService = inject(AuthService);
    http = inject(HttpClient);
    router = inject(Router);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.accessToken();
        let authReq = req;
        if (token) {
            authReq = this.addToken(req, token);
        }
        return next.handle(authReq).pipe(
            catchError(error => {
                if (error.status === 401 && !req.url.includes('/auth/refresh')) {
                    return this.handle401(authReq, next);
                }
                return throwError(() => error);
            })
        );

    }

    private addToken(req: HttpRequest<any>, token: string) {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });


    }
    private handle401(req: HttpRequest<any>, next: HttpHandler) {

        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap(res => {
                    this.isRefreshing = false;
                    this.authService.setAccessToken(res.accessToken);
                    this.refreshSubject.next(res.accessToken);
                    return next.handle(this.addToken(req, res.accessToken));
                }),
                catchError(err => {
                    this.isRefreshing = false;
                    this.authService.logout();
                    this.router.navigate(['/login']);
                    return throwError(() => err);
                })
            );

        } else {
            return this.refreshSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token =>
                    next.handle(this.addToken(req, token!))
                )
            );
        }
    }
}