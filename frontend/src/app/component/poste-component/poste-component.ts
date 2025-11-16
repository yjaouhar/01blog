import { Component, inject, Input, signal } from '@angular/core';
import { PostModel } from '../../model/poste-model';
import { HomeDirectives } from "../../directives/home-directives";
import { PosteServices } from '../../services/poste.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { EditPostComponent } from "../edit-post-component/edit-post-component";
import { DeletPostComponent } from "../delet-post-component/delet-post-component";

@Component({
  selector: 'app-poste-component',
  imports: [HomeDirectives, CommonModule, FormsModule, EditPostComponent, DeletPostComponent],
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
