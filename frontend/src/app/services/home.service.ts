import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { GlobalResponce } from '../model/globalResponce.type';
import { Post } from '../model/post.type';
import { catchError, throwError } from 'rxjs';
import { LoadingService } from './loading.service';
import { environment } from '../../environments/enveronment';
import { Notification } from '../model/notification.type';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  http = inject(HttpClient)
  url = environment.apiUrl;
  getPodteData() {
    return this.http.get<GlobalResponce<Post[]>>(`${this.url}/api/post`).pipe(
      catchError(
        err => {
          console.log("error in get post : ", err);
          return throwError(() => err)
        }
      )
    );

  }

  getNotification() {
    return this.http.get<GlobalResponce<Notification[]>>(`${this.url}/api/notification`).pipe(
      catchError(err => throwError(() => err))
    );
  }
  togellNotification(id :string) {
    return this.http.patch<GlobalResponce<string>>(`${this.url}/api/notification/${id}` ,{}).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
