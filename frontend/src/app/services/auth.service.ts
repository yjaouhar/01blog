import { inject, Injectable } from '@angular/core';
import { BasicAuthType } from '../model/basicAuth.type';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
type Response = {
  success: boolean,
  message: message[] | null;
}
type message = {
  message: string
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  router: Router = inject(Router);
  http = inject(HttpClient)
  register(formData: FormData): Observable<Response> {

    return this.http.post('http://localhost:8080/api/auth/register', formData).pipe(
      map(() => {
        return { success: true, message: null }
      }),
      catchError((err) => {
        if (err.status === 400) {
          return of({ success: false, message: err.error.errors });
        }
        return throwError(() => err);
      })
    )

  }
  logine(basicAuth: BasicAuthType): Observable<Response> {
    return this.http.post<{ data: message[] }>('http://localhost:8080/api/auth/login', basicAuth, { withCredentials: true }).pipe(
      map((res) => {
        const data = res.data;
        return { success: true, message: data }
      }),
      catchError((err) => {
        if (err.status === 400 || err.status === 401) {
          return of({ success: false, message: err.error.errors })
        }
        return throwError(() => err);
      })
    )
  }
  logout(): void {
    this.http.post('http://localhost:8080/api/auth/logout', {}).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });

  }
  getMe(): Observable<any> {
    return this.http.get('http://localhost:8080/api/auth/me', { withCredentials: true });
  }

  refreshToken() {
    return this.http.post<{ data: string }>(
      'http://localhost:8080/api/auth/refresh',
      {}, { withCredentials: true }
    );
  }


}
