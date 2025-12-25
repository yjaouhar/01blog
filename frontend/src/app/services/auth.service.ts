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

  constructor(
    private router: Router
  ) { }
  http = inject(HttpClient)
  register(formData: FormData): Observable<Response> {

    return this.http.post('http://localhost:8080/api/auth/register', formData).pipe(
      map(() => {
        return { success: true, message: null }
      }),
      catchError((err) => {
        console.log("------> error in catchError for register : ", err.error);
        return of({ success: false, message: err.error.errors })
      })
    )

  }
  logine(basicAuth: BasicAuthType): Observable<Response> {
    return this.http.post<{ data: message[] }>('http://localhost:8080/api/auth/login', basicAuth, { withCredentials: true }).pipe(
      map((res) => {
        // console.log("jwt : ", res);
        const data = res.data;
        return { success: true, message: data }
      }),
      catchError((err) => {
        console.log("------> error in catchError for login : ", err.error);
        return of({ success: false, message: err.error.errors })
      })
    )
  }
  logout(): void {
    this.http.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        console.log("logout success");
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('token');
        }
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log("Logout error: ", err);
      }
    });

  }
  getMe(): Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/me', {}, { withCredentials: true });

  }
  refreshToken() {
    return this.http.post<{ accessToken: string }>(
      'http://localhost:8080/api/auth/refresh',
      {},
      { withCredentials: true }
    );
  }
  accessToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
  setAccessToken(token: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('access_token', token);
    }
  }
}
