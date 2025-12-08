import { Component, signal } from '@angular/core';
import { AppRoutes } from "../../app.routes";
import { RouterLink } from '@angular/router';
import { ReportPosteModel } from '../../model/reportPost-model';
import { ReportUserModel } from '../../model/reportUser-model';
import { PosteComponent } from "../../componentes/poste.component/poste-component";
import { PostModel } from '../../model/post.model';
import { ConfirmComponent } from "../../componentes/confirm-component/confirm-component";
import { CommentComponent } from "../../componentes/comment-component/comment-component";

@Component({
  selector: 'app-admin-panel',
  imports: [RouterLink, PosteComponent, ConfirmComponent, CommentComponent],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {

  selectUserId = signal('');
  selectPostId = signal('');
  tab: string = 'users';
  viewPost = false;
  selectPost!: PostModel;
  stats = {
    totalUsers: 1234,
    totalPosts: 5678,
    activeReports: 23,
    banned: 14
  };

  users: ReportUserModel[] = [
    { id: '1', username: 'yjaouhar', email: 'user@gmail.com', avatar: 'https://i.pravatar.cc/40?u=1' },
    { id: '2', username: 'tarik_dev', email: 'tarik@gmail.com', avatar: 'https://i.pravatar.cc/40?u=2' },
  ];

  posts: PostModel[] = [
    {

      id: '1',
      authore: 'yassine jaouhary',
      avatar: '/d.jpg',
      time: new Date,
      title: 'Sunset in Marrakech',
      descreption: 'The colors of the sky tonight were magical 🌅.',
      mediaType: 'image',
      mediaUrl: '/p.jpg',
      totalLike: 120,
      totalComment: 14,
      liked: true
    },
    {
      id: '2',
      authore: 'yassine jaouhary',
      avatar: '/d.jpg',
      time: new Date,
      title: 'Coding Night',
      descreption: 'Late night debugging session with coffee ☕ and lo-fi beats.',
      mediaType: 'image',
      mediaUrl: '/p.jpg',
      totalLike: 85,
      totalComment: 9,
      liked: false
    },
  ];

  reports = [
    { id: 1, reason: 'Inappropriate post', reportedBy: 'user123', time: '2h ago', type: 'post', target: { id: 88 }, targetUser: 'badUser97' },
    { id: 2, reason: 'Abusive message', reportedBy: 'user654', time: '1h ago', type: 'user', targetUser: 'badUser97' },
  ];

  banned = [
    { id: '1', type: 'User', name: 'badUser97', date: '23 Oct' },
    { id: '2', type: 'Post', name: 'Post #32', date: '21 Oct' },
  ];

  changeSelectedUser(id: string) {
    this.selectUserId.update(v => id)
  }
  changeSelectedPost(id: string) {
    this.selectPostId.update(v => id)
  }
  viewpost(post: PostModel) {
    this.viewPost = true;
    this.selectPost = post;
  }
  banUser(conferm: boolean, id: string) {
    console.log("-----> ban: ", conferm, id);

    console.log('Ban', id);
  }
  banPoste(conferm: boolean, id: string) {
    console.log('Ban', id);
  }
  deleteUser(conferm: boolean, id: string) {
    console.log('Delete post', id);
  }
  deletePost(conferm: boolean, id: string) {
    console.log('Delete post', id);
  }
  unban(conferm: boolean, target: string) {
    console.log('Unban', target);
  }

}
