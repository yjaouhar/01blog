import { Component, signal } from '@angular/core';
import { AppRoutes } from "../../app.routes";
import { RouterLink } from '@angular/router';
import { ReportPosteModel } from '../../model/reportPost.type';
import { ReportUserModel } from '../../model/reportUser.type';
import { PosteComponent } from "../../componentes/poste.component/poste-component";
import { PostModel } from '../../model/post.type';
import { ConfirmComponent } from "../../componentes/confirm-component/confirm-component";
import { CommentComponent } from "../../componentes/comment-component/comment-component";

@Component({
  selector: 'app-admin-panel',
  imports: [ ConfirmComponent],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {

  selectUserId = signal('');
  selectPostId = signal('');
  tab: string = 'users';
  viewPost = false;
  // selectPost!: PostModel;
  stats = {
    totalUsers: 1234,
    totalPosts: 5678,
    activeReports: 23,
    banned: 14
  };


  // posts: PostModel;





  changeSelectedUser(id: string) {
    this.selectUserId.update(v => id)
  }
  changeSelectedPost(id: string) {
    this.selectPostId.update(v => id)
  }

 
  banPoste(conferm: boolean, id: string) {
    console.log('Ban', id);
  }

  deletePost(conferm: boolean, id: string) {
    console.log('Delete post', id);
  }
  unban(conferm: boolean, target: string) {
    console.log('Unban', target);
  }

}
