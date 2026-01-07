import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostCreateComponent } from "../post-create-component/post-create-component";
import { User } from '../../model/user.type';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/enveronment';
import { Loading } from "../loading/loading";

@Component({
  selector: 'app-app-header',
  imports: [PostCreateComponent, CommonModule, Loading],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {

  authService = inject(AuthService);
  url = environment.apiUrl;
  logout() {
    this.authService.logout();
  }
  showCreatPostPop = signal(false);
  toggelShowCreatPostPop(show: boolean) {
    this.showCreatPostPop.set(show)
  }
}
