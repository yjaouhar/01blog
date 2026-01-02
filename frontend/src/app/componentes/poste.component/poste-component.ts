import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Post, PostModel } from '../../model/post.type';
import { CommentComponent } from "../comment-component/comment-component";
import { PostTemplateComponent } from "../post-template-component/post-template-component";
import { CommonModule } from '@angular/common';
import { LikeDirective } from "../../directive/like-directive";
import { PostService } from '../../services/post.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-poste-component',
  imports: [CommentComponent, PostTemplateComponent, CommonModule, LikeDirective, RouterLink],
  standalone: true,
  templateUrl: './poste-component.html',
  styleUrl: './poste-component.css',
})
export class PosteComponent implements OnInit {
  postService = inject(PostService)
  // postes = signal<Post[]>([])
  @Input({ required: true }) postesData!: PostModel;
  @Input() showReaction!: boolean;

  ngOnInit(): void {
  }
  remove(id: string) {
    this.postesData.data = this.postesData.data.filter(p => p.id !== id);
  }
  handelLike(post: Post) {

    // const success = this.postService.likePoste(post.id);
    // if (success) {
    // this.postes = this.postes.map(p => {
    //   if (p.id === post.id) {
    //     p.totalLike = p.liked ? p.totalLike - 1 : p.totalLike + 1
    //     p.liked = !p.liked;
    //     return p
    //   }
    //   return p
    // })
    // this.post = {
    //   ...this.post,
    //   liked: !this.post.liked,
    //   totalLike: this.post.liked ? this.post.totalLike - 1 : this.post.totalLike + 1
    // };




    // }

  }
}
