import { inject, Injectable } from '@angular/core';
import { BasicAuthType } from '../model/basicAuth.type';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
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

  http = inject(HttpClient)
  register(formData: FormData): Observable<Response> {

    return this.http.post('http://localhost:8080/api/auth/register', formData).pipe(
      map(() => {
        return { success: true, message: null }
      }),
      catchError((err) => {
        console.log("------> error in catchError : ", err.error);
        return of({ success: false, message: err.error.errors })
      })
    )

  }
  logine(basicAuth: BasicAuthType) {
    console.log(basicAuth);
  }
}
