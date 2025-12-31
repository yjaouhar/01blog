import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-app-header',
  imports: [],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  authService = inject(AuthService);
  logout() {
    this.authService.logout();
  }
}
