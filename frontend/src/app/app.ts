import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorPopComponent } from "./componentes/error-pop-component/error-pop-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorPopComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
