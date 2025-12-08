import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public router: Router) { }
  active = signal('h')
  changeIcone(icon: string) {
    this.active.update(() => icon);
  }

  isAutPage() {
    return this.router.url === '/login' || this.router.url === '/register'
  }
}
