import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { PostModel } from '../../model/poste-model';
import { HomeDirectives } from "../../directives/home-directives";
import { PosteServices } from '../../services/poste.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { EditPostComponent } from "../edit-post-component/edit-post-component";
import { DeletPostComponent } from "../delet-post-component/delet-post-component";
import { ReportPostComponent } from "../report-post-component/report-post-component";
import { CommentComponent } from "../comment-component/comment-component";

@Component({
  selector: 'app-poste-component',
  imports: [HomeDirectives, CommonModule, FormsModule, EditPostComponent, DeletPostComponent, ReportPostComponent, CommentComponent],
  templateUrl: './poste-component.html',
  styleUrls: ['./poste-component.css'],
})
export class PosteComponent {

  postServices = inject(PosteServices)
  // postes = signal<PostModel[]>(this.postServices.getPodteData());
  @Input() poste!: PostModel[];
  @Input() isCommentDisabled!: boolean;


  // @Input() post!: PostModel
  selectedPostId: number | null = null;
  selectedPost: any = null;

  openDeleteModal(postId: number) {
    this.selectedPostId = postId;
  }

  openEditModal(post: any) {
    this.selectedPost = { ...post };
  }
  handelLike(post: PostModel) {
    const success = this.postServices.likePoste(post.id);
    if (success) {
        // this.post = {
        //   ...this.post,
        //   liked: !this.post.liked,
        //   totalLike: this.post.liked ? this.post.totalLike - 1 : this.post.totalLike + 1
        // };
      



    }

  }


}
