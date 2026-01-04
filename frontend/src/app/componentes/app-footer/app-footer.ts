import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { User } from '../../model/user.type';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-footer',
  imports: [RouterLink, RouterModule , CommonModule],
  templateUrl: './app-footer.html',
  styleUrl: './app-footer.css',
})
export class AppFooter {
  authService = inject(AuthService);
}
