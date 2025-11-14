import { Component, inject, Input, signal } from '@angular/core';
import { CommentComponent } from "../comment-component/comment-component";
import { PostModel } from '../../model/poste-model';
import { HomeDirectives } from "../../directives/home-directives";
import { PosteServices } from '../../services/poste.services';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-poste-component',
  imports: [HomeDirectives, CommonModule, FormsModule],
  templateUrl: './poste-component.html',
  styleUrls: ['./poste-component.css'],
})
export class PosteComponent {

  postServices = inject(PosteServices)
  // postes = signal<PostModel[]>(this.postServices.getPodteData());
  @Input() isCommentDisabled!: boolean;


  @Input() post!: PostModel
  handelLike(postId: number) {
    const success = this.postServices.likePoste(postId);
    if (success) {
      if (this.post.id === postId) {
        this.post = {
          ...this.post,
          liked: !this.post.liked,
          totalLike: this.post.liked ? this.post.totalLike - 1 : this.post.totalLike + 1
        };
      }



    }

  }


}
