import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Post } from '../../model/post.type';
import { CommentComponent } from "../comment-component/comment-component";
import { PostTemplateComponent } from "../post-template-component/post-template-component";
import { CommonModule } from '@angular/common';
import { LikeDirective } from "../../directive/like-directive";
import { PostService } from '../../services/post.service';
import { LoadingService } from '../../services/loading.service';
import { NotResorce } from "../not-resorce/not-resorce";

@Component({
  selector: 'app-poste-component',
  imports: [CommentComponent, PostTemplateComponent, CommonModule, LikeDirective, NotResorce],
  standalone: true,
  templateUrl: './poste-component.html',
  styleUrl: './poste-component.css',
})
export class PosteComponent implements OnInit {
  postService = inject(PostService)
  loadingService = inject(LoadingService)
  showComment = signal(false);
  selecrPost = signal<Post | null>(null)
  like = signal(false)
  @Input({ required: true }) postesData!: Post[];
  @Input() showReaction!: boolean;

  ngOnInit(): void {
  }
  remove(id: string) {
    this.postesData = this.postesData.filter(p => p.id !== id);
  }
  handelLike(post: Post) {
    this.loadingService.show()
    this.like.set(true)
    this.postService.likePoste(post.id).subscribe({
      next: res => {
        console.log("like success : ", res);
        this.postesData = this.postesData.map(p => {
          if (p.id === post.id) {
            p.totalLike = p.liked ? p.totalLike - 1 : p.totalLike + 1;
            p.liked = !p.liked
            return p;
          }
          return p
        })
        this.like.set(false)
        this.loadingService.hide()
      }
    })
  }
  open(post: Post) {
    this.selecrPost.set(post)
    this.showComment.set(true)
  }
  close() {
    this.showComment.set(false)
  }
}
