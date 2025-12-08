import { Component, inject, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { PostModel } from '../../model/post.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostTemplateComponent } from "../post-template-component/post-template-component";

@Component({
  selector: 'app-comment-component',
  imports: [CommonModule, FormsModule, PostTemplateComponent],
  standalone: true,
  templateUrl: './comment-component.html',
  styleUrl: './comment-component.css',
})
export class CommentComponent {
  postServices = inject(PostService)
  commentText = '';
  @Input() post!: PostModel;
  comments = this.postServices.getComment(1);
  ngAfterViewInit() {
    const modalEl = document.getElementById('commentModal' + this.post.id);
    if (!modalEl) return;

    modalEl.addEventListener('hide.bs.modal', () => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
  handelComment(postId: string) {
    if (!this.commentText.trim()) {
      return
    }
    const success = this.postServices.commentPoste({
      postId,
      content: this.commentText
    });
    if (success) {
      this.comments.unshift({
        author: "test",
        avatar: "/d.jpg",
        text: this.commentText,
        time: "1min"

      })
      this.post.totalComment = this.post.totalComment + 1
      this.commentText = ''
    }

  }
}
