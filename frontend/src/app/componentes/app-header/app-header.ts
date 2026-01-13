import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostCreateComponent } from "../post-create-component/post-create-component";
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/enveronment';
import { HomeService } from '../../services/home.service';
import { Notification } from '../../model/notification.type';
import { UtilsService } from '../../services/utils.service';
import { LoadingService } from '../../services/loading.service';
import { Post } from '../../model/post.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-app-header',
  imports: [PostCreateComponent, CommonModule, RouterLink],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader implements OnInit {
  @Output() newPost = new EventEmitter<Post>();
  authService = inject(AuthService);
  homeService = inject(HomeService);
  loadService = inject(LoadingService)
  utils = inject(UtilsService);
  url = environment.apiUrl;
  notif = signal<Notification[]>([])
  newNotif = signal(false);
  ngOnInit(): void {
    this.getNotification()
  }
  logout() {
    this.authService.logout();
  }
  getNotification() {
    console.log("###");

    this.homeService.getNotification().subscribe({
      next: res => {
        this.notif.set(res.data)
        this.checkForNew()
      }
    })
  }
  showCreatPostPop = signal(false);
  toggelShowCreatPostPop(show: boolean) {
    this.showCreatPostPop.set(show)
  }
  addNewPost(event: Post | null) {
    this.showCreatPostPop.set(false)
    if (event) {
      this.newPost.emit(event);
    }
  }


  toggel(notifId: string) {
    this.loadService.show()
    this.homeService.togellNotification(notifId).subscribe({
      next: () => {
        this.notif.update(arr => arr.map(n => {
          if (n.id === notifId) {
            return { ...n, read: !n.read }
          }
          return n
        }))
        this.checkForNew()
        this.loadService.hide()
      },
      error: err => {
        this.loadService.hide()

        throw err
      }
    })
  }
  checkForNew() {
    this.newNotif.set(this.notif().some(n => !n.read))
  }
}
