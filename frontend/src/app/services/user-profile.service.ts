import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/enveronment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  getUserProfile(username: string) {
    // return this.http.get(`${environment.apiUrl}/profile/${username}`).pipe(
    //   catchError(err => throwError(() => err))
    // );
    return {
      id: "45678f78d9",
      avatar: "/d.jpg",
      username: 'yjaouhr',
      firstName: "yassine",
      lastName : "jaouhary",
      age: "20/30/2002",
      gander: "male",
      bio: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu",
      email: "yassinejaouhary@gmail.com",
      totalPoste: 30,
      totalFollow: 60,
      totalFollowing: 2322,
      isFollowing: true,
    }
  }


}
