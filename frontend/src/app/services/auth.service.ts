import { inject, Injectable, signal } from '@angular/core';
import { BasicAuthType } from '../model/basicAuth.type';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, finalize, map, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../model/user.type';
import { GlobalResponce } from '../model/globalResponce.type';
type Response = {
  success: boolean,
  message: string[] | null;
}
// type message = {
//   message: string
// }
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router: Router = inject(Router);
  http = inject(HttpClient)
  private refreshInProgress = false;

  register(formData: FormData): Observable<Response> {

    return this.http.post<GlobalResponce<string>>('http://localhost:8080/api/auth/register', formData).pipe(
      map((res) => {
        return { success: true, message: [res?.data] }
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
    return this.http.post<GlobalResponce<string>>('http://localhost:8080/api/auth/login', basicAuth, { withCredentials: true }).pipe(
      map((res) => {
        return { success: true, message: [res?.data] }
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
    this.http.post<GlobalResponce<string>>('http://localhost:8080/api/auth/logout', {}).pipe(
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
    return this.http.get<GlobalResponce<string>>('http://localhost:8080/api/auth/me', { withCredentials: true })
  }
  refreshToken() {
    if (this.refreshInProgress) {
      return EMPTY;
    }
    this.refreshInProgress = true;

    return this.http.post<GlobalResponce<string>>(
      'http://localhost:8080/api/auth/refresh',
      {}, { withCredentials: true }
    ).pipe(
      finalize(() => this.refreshInProgress = false));
  }

}
