import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavBareDirective } from "./directive/nav-bare-directive";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  active = signal('h')
  changeIcone(icon: string) {
    this.active.update(() => icon);
  }

}
