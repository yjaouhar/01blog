import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ErrorPopComponent } from "./componentes/error-pop-component/error-pop-component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ErrorPopComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


  authService = inject(AuthService);
  constructor(public router: Router) {
    // this.authService.authReady$.subscribe(v => {
    //   this.authReady = v;
    // });
  }
  active = signal('h')
  changeIcone(icon: string) {
    this.active.update(() => icon);
  }

  isAutPage() {
    return this.router.url === '/login' || this.router.url === '/register'
  }

  logout() {
    this.authService.logout();
  }
  // authReady = false;


}
