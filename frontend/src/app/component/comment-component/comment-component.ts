import { Component, Input } from '@angular/core';
interface Comment {
  author: string;
  avatar?: string;
  text: string;
  time: string;
}
@Component({
  selector: 'app-comment-component',
  imports: [],
  templateUrl: './comment-component.html',
  styleUrl: './comment-component.css',
})
export class CommentComponent {
  @Input() comment!: Comment;
  comments = [
    { author: 'Yassine', avatar: '/avatar1.png', text: 'Great post!', time: '5 min ago' },
    { author: 'Sara', avatar: '/avatar2.png', text: 'Thanks for sharing', time: '10 min ago' }
  ];

}
