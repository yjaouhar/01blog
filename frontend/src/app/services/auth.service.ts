import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BasicAuthType } from '../model/basicAuth.type';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
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


  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  router: Router = inject(Router);
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
        const data = res.data;
        console.log("------> login response data : ", data);
        return { success: true, message: data }
      }),
      catchError((err) => {
        console.log("------> error in catchError for login : ", err.error);
        return of({ success: false, message: err.error.errors })
      })
    )
  }
  logout(): void {
    this.http.post('http://localhost:8080/api/auth/logout', {}).subscribe({
      next: () => {
        console.log("logout success");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log("Logout error: ", err);
      }
    });

  }
  getMe(): Observable<any> {
    // return this.http.get('http://localhost:8080/api/auth/me', { withCredentials: true });
    if (isPlatformBrowser(this.platformId)) {
      console.log("in browser getMe()");

      return this.http.get('http://localhost:8080/api/auth/me', { withCredentials: true });
    } else {
      // فال SSR، ممكن ترجّع null أو fallback data
      console.log("in ser getMe()");
      return of(null);
    }

  }

  refreshToken() {
    return this.http.post<{ data: string }>(
      'http://localhost:8080/api/auth/refresh',
      {}, { withCredentials: true }
    );
  }


}
