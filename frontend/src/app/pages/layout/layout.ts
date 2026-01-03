import { Component, inject, OnInit, signal } from '@angular/core';
import { AppRoutes } from "../../app.routes";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppHeader } from "../../componentes/app-header/app-header";
import { AppFooter } from "../../componentes/app-footer/app-footer";
import { filter } from 'rxjs';
import { HomeService } from '../../services/home.service';
import { PosteComponent } from "../../componentes/poste.component/poste-component";
import { PostModel } from '../../model/post.type';
import { LoadingService } from '../../services/loading.service';
import { Loading } from "../../componentes/loading/loading";
import { PostCreateComponent } from "../../componentes/post-create-component/post-create-component";
import { NotResorce } from "../../componentes/not-resorce/not-resorce";
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, AppHeader, AppFooter, PosteComponent, Loading, NotResorce],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  homeService = inject(HomeService)
  loadingService = inject(LoadingService)
  router = inject(Router)
  utils = inject(UtilsService);
  isHomePage = signal(true);
  loding = signal(true);
  start = signal(true);
  postes = signal<PostModel | null>(null)

  ngOnInit(): void {
    this.loadingService.show();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage.set(event.urlAfterRedirects === '/');
    });
    this.homeService.getPodteData().subscribe({
      next: res => {
        this.start.set(false)
        console.log("++++++", res.data);
        this.postes.set(res.data)
      },
      complete: () => {
        this.loadingService.hide()
      }
    });
  }
}
