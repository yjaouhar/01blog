import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostCreateComponent } from "../post-create-component/post-create-component";

@Component({
  selector: 'app-app-header',
  imports: [PostCreateComponent],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  authService = inject(AuthService);
  logout() {
    this.authService.logout();
  }
  showCreatPostPop = signal(false);
  toggelShowCreatPostPop(show: boolean) {    
    this.showCreatPostPop.set(show)
  }
}
