import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ErrorPopComponent } from "./componentes/error-pop-component/error-pop-component";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorPopComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  authSrvice = inject(AuthService)
  router = inject(Router)
 
}
