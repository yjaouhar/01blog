import { Component, inject, Input } from '@angular/core';
import { PostModel } from '../../model/poste-model';
import { PosteComponent } from "../poste-component/poste-component";
import { HomeDirectives } from '../../directives/home-directives';
import { PosteServices } from '../../services/poste.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Comment {
  author: string;
  avatar?: string;
  text: string;
  time: string;
}
@Component({
  selector: 'app-comment-component',
  imports: [CommonModule, FormsModule, PosteComponent],
  templateUrl: './comment-component.html',
  styleUrl: './comment-component.css',
})
export class CommentComponent {
  postServices = inject(PosteServices)
  commentText = '';
  @Input() post!: PostModel;
  comments = this.postServices.getComment(1);
  handelComment(postId: number) {
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
      this.post.totalComment=this.post.totalComment+1
      this.commentText=''
    }

  }
  testClick() {
    console.log("**********");

  }
}
