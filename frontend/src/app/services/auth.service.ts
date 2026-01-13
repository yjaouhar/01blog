import { inject, Injectable, signal } from '@angular/core';
import { BasicAuthType } from '../model/basicAuth.type';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, finalize, map, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../model/user.type';
import { GlobalResponce } from '../model/globalResponce.type';
import { environment } from '../../environments/enveronment';
type Response = {
  success: boolean,
  message: string[] | null;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router: Router = inject(Router);
  http = inject(HttpClient)
  private refreshInProgress = false;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  login = false;

  setUser(user: User) {
    this.userSubject.next(user);
  }
  isLogine() {
    return this.login;
  }
  register(formData: FormData): Observable<Response> {

    return this.http.post<GlobalResponce<string>>(`${environment.apiUrl}/api/auth/register`, formData).pipe(
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
    return this.http.post<GlobalResponce<User>>(`${environment.apiUrl}/api/auth/login`, basicAuth, { withCredentials: true }).pipe(
      map((res) => {
        // console.log("logine", res.data);
        this.setUser(res.data);
        this.login = true
        return { success: true, message: [] }
      }),
      catchError((err) => {
        this.login = false
        if (err.status === 400 || err.status === 401) {
          return of({ success: false, message: err.error.errors })
        }
        return throwError(() => err);
      })
    )
  }
  logout(): void {
    this.http.post<GlobalResponce<string>>(`${environment.apiUrl}/api/auth/logout`, {}).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        this.login = false
        this.router.navigate(['/login']);
      }
    });

  }
  getMe(): Observable<any> {
    return this.http.get<GlobalResponce<User>>(`${environment.apiUrl}/api/auth/me`, { withCredentials: true }).pipe(
      map(res => {
        this.setUser(res.data);
        this.login = true
        return res
      })
    )
  }
  refreshToken() {
    if (this.refreshInProgress) {
      return EMPTY;
    }
    this.refreshInProgress = true;

    return this.http.post<GlobalResponce<User>>(
      `${environment.apiUrl}/api/auth/refresh`,
      {}, { withCredentials: true }
    ).pipe(
      map(res => {
        this.setUser(res.data);
        this.login = true
        return res;
      }),
      finalize(() => this.refreshInProgress = false));
  }

}
