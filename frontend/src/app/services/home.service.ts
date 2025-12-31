import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { GlobalResponce } from '../model/globalResponce.type';
import { PostModel } from '../model/post.type';
import { catchError, throwError } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  http = inject(HttpClient)

  getPodteData() {

    return this.http.get<GlobalResponce<any>>("http://localhost:8080/api/post").pipe(
      catchError(
        err => {

          console.log("error in get post : ", err);
          return throwError(() => err)
        }
      )
    );

  }
}
