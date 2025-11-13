import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavSelecl } from "./directives/nav-selecl";
import { single } from 'rxjs';
import { Home } from './page/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NavSelecl],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  active = signal('h')
  changeIcone(icon: string) {
    this.active.update(() => icon);
  }


}
