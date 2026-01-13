import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalResponce } from '../model/globalResponce.type';
import { catchError, map, throwError } from 'rxjs';
import { Media, Post } from '../model/post.type';
import { environment } from '../../environments/enveronment';
import { CommentModal } from '../model/comment.type';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http = inject(HttpClient)

  getPoste(id: string) {
    return this.http.get<GlobalResponce<Post>>(`http://localhost:8080/api/post/${id}`).pipe(
      catchError(
        err => {
          return throwError(() => err)
        }
      )
    );

  }

  likePoste(postId: string) {
    return this.http.post(`${environment.apiUrl}/api/post/like/${postId}`, {}).pipe(
      catchError(err => throwError(() => err))
    )
  }


  commentPoste(postId: string, description: string) {
    return this.http.post<GlobalResponce<CommentModal>>(`${environment.apiUrl}/api/post/comment`, {
      description,
      postId
    }).pipe(
      catchError(err => throwError(() => err))
    );
  }


  getComment(postId: string) {

    return this.http.get<GlobalResponce<CommentModal[]>>(`${environment.apiUrl}/api/post/comment/${postId}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
  deletComment(commentId: string) {
    return this.http.delete<GlobalResponce<string>>(`${environment.apiUrl}/api/post/comment/${commentId}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    );
  }


  creatPost(form: FormData) {
    return this.http.post<GlobalResponce<Post>>(`${environment.apiUrl}/api/post`, form).pipe(
      catchError(err => throwError(() => err))
    );
  }

  editePost(form: FormData) {
    return this.http.patch<GlobalResponce<Media[]>>(`${environment.apiUrl}/api/post`, form).pipe(
      catchError(err => {
        // console.log("catch Error : ", err);

        return throwError(() => err)
      })
    );
  }
  deletPost(postId: string) {
    return this.http.delete<GlobalResponce<string>>(`${environment.apiUrl}/api/post/${postId}`).pipe(
      catchError(err => {
        // console.log("catch Error : ", err);

        return throwError(() => err)
      })
    );
  }

  reportPost(postId: string, reason: string) {
    const body = {
      reportedPost: postId,
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

  cropImageToSquare(file: File, size = 150): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = e => img.src = e.target!.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No context');

        // crop center
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject('Crop failed');
        }, file.type);
      };

      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
