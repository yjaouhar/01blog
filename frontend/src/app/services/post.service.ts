import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PostService {
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

}
