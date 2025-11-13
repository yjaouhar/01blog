import { Component } from '@angular/core';
import { HomeDirectives } from "../../directives/home-directives";
import { CommentComponent } from '../../component/comment-component/comment-component';

@Component({
  selector: 'app-home',
  imports: [HomeDirectives , CommentComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  comments = [
    { author: 'Yassine jaouhary', avatar: '/1762882197859_WhatsApp Image 2025-10-15 at 19.54.57.jpeg', text: 'Great post!', time: '5 min ago' },
    { author: 'jaouhaer yassine', avatar: '/1762882197859_WhatsApp Image 2025-10-15 at 19.54.57.jpeg', text: 'Thanks for sharing', time: '10 min ago' }
  ];
}
