import { Component, inject, input, Input } from '@angular/core';
import { PostModel } from '../../model/post.model';
import { CommentComponent } from "../comment-component/comment-component";
import { PostTemplateComponent } from "../post-template-component/post-template-component";
import { CommonModule } from '@angular/common';
import { LikeDirective } from "../../directive/like-directive";
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-poste-component',
  imports: [CommentComponent, PostTemplateComponent, CommonModule, LikeDirective],
  standalone: true,
  templateUrl: './poste-component.html',
  styleUrl: './poste-component.css',
})
export class PosteComponent {
  postService = inject(PostService)

  @Input() postes!: PostModel[];
  @Input() showReaction!: boolean;

  handelLike(post: PostModel) {

    const success = this.postService.likePoste(post.id);
    if (success) {
      this.postes = this.postes.map(p => {
        if (p.id === post.id) {
          p.totalLike = p.liked ? p.totalLike - 1 : p.totalLike + 1
          p.liked = !p.liked;
          return p
        }
        return p
      })
      // this.post = {
      //   ...this.post,
      //   liked: !this.post.liked,
      //   totalLike: this.post.liked ? this.post.totalLike - 1 : this.post.totalLike + 1
      // };




    }

  }
}
