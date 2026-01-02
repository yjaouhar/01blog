import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalResponce } from '../model/globalResponce.type';
import { catchError, throwError } from 'rxjs';
import { Media } from '../model/post.type';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http = inject(HttpClient)
  likePoste(postId: string): boolean {
    console.log("----> like the post ", postId);
    return true
  }


  commentPoste(commentDetails: object): boolean {
    console.log("----> new comment for the post ", commentDetails);
    return true
  }


  getComment(postId: number) {
    return [
      { author: 'Yassine', avatar: '/prof.png', text: 'Great post!', time: '5 min ago' },
      { author: 'Sara', avatar: '/p.jpg', text: 'Thanks for sharing', time: '10 min ago' }
    ]
  }
  creatPost(form: FormData) {
    return this.http.post<GlobalResponce<string>>("http://localhost:8080/api/post", form).pipe(
      catchError(err => throwError(() => err))
    );
  }

  editePost(form: FormData) {
    return this.http.patch<GlobalResponce<Media[]>>("http://localhost:8080/api/post", form).pipe(
      catchError(err => {
        console.log("catch Error : ", err);

        return throwError(() => err)
      })
    );
  }
  deletPost(postId:string) {
    return this.http.delete<GlobalResponce<string>>(`http://localhost:8080/api/post/${postId}`).pipe(
      catchError(err => {
        console.log("catch Error : ", err);

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
