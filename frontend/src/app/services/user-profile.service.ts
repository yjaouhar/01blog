import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/enveronment';
import { GlobalResponce } from '../model/globalResponce.type';
import { ProfileModel } from '../model/profileInfo.type';
import { Post } from '../model/post.type';
import { User } from '../model/discover.type';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  getUserProfile(username: string) {
    return this.http.get<GlobalResponce<ProfileModel>>(`${environment.apiUrl}/api/profile/${username}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  updateProfile(form: FormData) {
    return this.http.patch(`${environment.apiUrl}/api/profile`, form).pipe(
      catchError(err => throwError(() => err))
    )

  }
  reportUser(userId: string, reason: string) {
    const body = {
      reportedUser: userId,
      reason: reason
    }
    return this.http.post<GlobalResponce<string>>(`${environment.apiUrl}/api/report`, body)
      .pipe(
        catchError(err => {
          console.log("catch Error in report : ", err);
          return throwError(() => err)
        })
      );
  }

  getPostes(id: string) {
    return this.http.get<GlobalResponce<Post[]>>(`${environment.apiUrl}/api/profile/postes/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
  getFollowers(id: string) {
    return this.http.get<GlobalResponce<User[]>>(`${environment.apiUrl}/api/profile/followers/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
  getFollowing(id: string) {
    return this.http.get<GlobalResponce<User[]>>(`${environment.apiUrl}/api/profile/following/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
