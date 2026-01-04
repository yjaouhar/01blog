import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post, PostModel } from '../../model/post.type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostTemplateComponent } from "../post-template-component/post-template-component";
import { CommentModal } from '../../model/comment.type';
import { UtilsService } from '../../services/utils.service';
import { NotResorce } from "../not-resorce/not-resorce";
import { environment } from '../../../environments/enveronment';
import { Confermation } from "../confermation/confermation";

@Component({
  selector: 'app-comment-component',
  imports: [CommonModule, FormsModule, PostTemplateComponent, NotResorce, Confermation, Confermation],
  standalone: true,
  templateUrl: './comment-component.html',
  styleUrl: './comment-component.css',
})
export class CommentComponent implements OnInit {
  @Input() post!: Post;
  postServices = inject(PostService);
  utils = inject(UtilsService);
  url = environment.apiUrl;
  commentText = '';
  comments = signal<CommentModal[]>([]);
  selectCommentId = signal<string | null>(null)
  showError = signal(false);
  errorMessage = signal('');
  showConfermation = signal(false);
  ngOnInit(): void {
    this.postServices.getComment(this.post.id).subscribe({
      next: res => {
        this.comments.set(res.data)
      }
    })
  }
  ngAfterViewInit() {
    const modalEl = document.getElementById('commentModal' + this.post.id);
    if (!modalEl) return;

    modalEl.addEventListener('hide.bs.modal', () => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
  handelComment(postId: string) {
    if (!this.commentText.trim()) {
      this.showError.set(true)
      this.errorMessage.set("Description Empty")
      return
    }
    if (this.commentText.trim().length > 500) {
      this.showError.set(true)
      this.errorMessage.set("Description cannot exceed 500 characters")
      return
    }
    this.showError.set(false)
    this.postServices.commentPoste(postId, this.commentText).subscribe({
      next: res => {
        if (res?.data) {
          this.comments.update(arr => [res?.data, ...arr])
        }
      }
    });
    this.commentText = ''
    this.post.totalComment = this.post.totalComment + 1

  }
  deletComment() {
    if (this.selectCommentId() === null) {
      return;
    }
    this.postServices.deletComment(this.selectCommentId()!).subscribe({
      next: () => {
        this.comments.update(comment => comment.filter(c => {
          if (c.id === this.selectCommentId()) {
            return false
          }
          return true
        }))
      }
    })
  }
  selctedComment(commentId: string) {
    this.selectCommentId.set(commentId);
    this.showConfermation.set(true)
  }

  confirm(event: boolean) {
    if (event) {
      this.deletComment()
      this.showConfermation.set(false);
    } else {
      this.showConfermation.set(false);
    }
  }

  chane() {
    this.showError.set(false)
  }
}
