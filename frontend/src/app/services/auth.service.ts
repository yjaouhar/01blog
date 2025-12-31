import { inject, Injectable, signal } from '@angular/core';
import { BasicAuthType } from '../model/basicAuth.type';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../model/user.type';
import { GlobalResponce } from '../model/globalResponce.type';
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
  private authReadySubject = new BehaviorSubject<User | null>(null);
  authReady$ = this.authReadySubject.asObservable();
  currentUser = signal<User | null>(null);
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
    return this.http.post<GlobalResponce<User>>('http://10.1.18.7:8080/api/auth/login', basicAuth, { withCredentials: true }).pipe(
      map((res) => {
        console.log("=====> login ", res);
        this.setUser(res.data)
        return { success: true, message: null }
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
        this.removeUser()
        this.router.navigate(['/login']);
      }
    });

  }
  getMe(): Observable<any> {
    return this.http.get('http://10.1.18.7:8080/api/auth/me', { withCredentials: true })
  }
  refreshToken() {
    return this.http.post<{ user: User }>(
      'http://localhost:8080/api/auth/refresh',
      {}, { withCredentials: true }
    );
  }

  isLoggedIn() {
    return !!this.currentUser();
  }
  getUser(): User | null {
    return this.authReadySubject.getValue();
  }
  setUser(user: User) {
    this.authReadySubject.next(user)
    this.currentUser.set(user)
  }
  removeUser() {
    this.currentUser.set(null)
    this.authReadySubject.next(null)

  }


}
