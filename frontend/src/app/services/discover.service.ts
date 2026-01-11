import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enveronment';
import { catchError, throwError } from 'rxjs';
import { GlobalResponce } from '../model/globalResponce.type';
import { User } from '../model/discover.type';

@Injectable({
  providedIn: 'root',
})
export class DiscoverService {
  http = inject(HttpClient);
  getUsers() {
    return this.http.get<GlobalResponce<User[]>>(`${environment.apiUrl}/api/users`).pipe(
      catchError(err => throwError(() => err))
    )
  };
  serche(keyword: string) {
    return this.http.get<GlobalResponce<User[]>>(`${environment.apiUrl}/api/users/serche/${keyword}`).pipe(
      catchError(err => throwError(() => err))
    )
  }

  subscribe(userId: string) {
   return this.http.post<GlobalResponce<string>>(`${environment.apiUrl}/api/users/subscrib/${userId}`, {}).pipe(
      catchError(err => throwError(() => err))
    )
  }
}
