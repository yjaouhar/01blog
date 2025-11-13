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
    { author: 'Yassine', avatar: '/1762882197859_WhatsApp Image 2025-10-15 at 19.54.57.jpeg', text: 'Great post!', time: '5 min ago' },
    { author: 'Sara', avatar: '/1762882197859_WhatsApp Image 2025-10-15 at 19.54.57.jpeg', text: 'Thanks for sharing', time: '10 min ago' }
  ];

}
