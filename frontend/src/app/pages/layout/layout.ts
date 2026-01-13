import { Component, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { AppRoutes } from "../../app.routes";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppHeader } from "../../componentes/app-header/app-header";
import { AppFooter } from "../../componentes/app-footer/app-footer";
import { filter } from 'rxjs';
import { HomeService } from '../../services/home.service';
import { PosteComponent } from "../../componentes/poste.component/poste-component";
import { Post } from '../../model/post.type';
import { LoadingService } from '../../services/loading.service';
import { Loading } from "../../componentes/loading/loading";
import { PostCreateComponent } from "../../componentes/post-create-component/post-create-component";
import { NotResorce } from "../../componentes/not-resorce/not-resorce";
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user.type';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, AppHeader, AppFooter, PosteComponent, Loading, NotResorce, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {

  homeService = inject(HomeService)
  loadingService = inject(LoadingService)
  router = inject(Router)
  utils = inject(UtilsService);
  isHomePage = signal(this.router.url === "/");
  start = signal(true);
  postes = signal<Post[]>([])
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/') {
        this.isHomePage.set(true);
        this.getPost()
      } else {
        this.isHomePage.set(false);
      }

    });
    if (this.isHomePage()) {
      this.getPost()
    }

  }


  getPost() {
    this.loadingService.show();
    this.homeService.getPodteData().subscribe({
      next: res => {
        this.start.set(false)
        this.postes.set(res.data)
      },
      error: err => {
        this.loadingService.hide()
        throw err
      },
      complete: () => {
        this.loadingService.hide()
      }
    });
  }
  addPost(post: Post) {
    this.postes.update(p => [post, ...p]);
    this.loadingService.hide()
  }
}
