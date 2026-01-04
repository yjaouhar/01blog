import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/enveronment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  getUserProfileWithUsername(username: string) {
    return this.http.get(`${environment.apiUrl}/profile/${username}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
  getUserProfile() {

    return {
      id: "!",
      avatar: '/prof.png',
      username: 'admin',
      name: 'yassine jaouhary',
      age: '21',
      gander: 'male',
      bio: 'hello word',
      email: 'yassine@gmail.com',
      totalPoste: 100,
      totalFollow: 1020,
      totalFollowing: 300,

    }
  }

}
