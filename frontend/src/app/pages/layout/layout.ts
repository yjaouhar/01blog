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

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, AppHeader, AppFooter, PosteComponent, Loading],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  isHomePage = signal(true);
  // loding = signal(true);
  router = inject(Router)
  homeService = inject(HomeService)
  postes = signal<PostModel[] | null>([])
  loadingService = inject(LoadingService)

  ngOnInit(): void {
    this.loadingService.show();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage.set(event.urlAfterRedirects === '/');
    });
    this.homeService.getPodteData().subscribe({
      next: res => {
        this.loadingService.hide()
        console.log("-----> postes : ", res);
      }
    });
  }
}
