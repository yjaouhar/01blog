import { Component, inject, Input, signal } from '@angular/core';
import { DiscoverModel } from '../../model/discover.type';
import { ConfirmComponent } from '../confirm-component/confirm-component';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/enveronment';
import { Loading } from "../loading/loading";
import { DiscoverService } from '../../services/discover.service';
import { Confermation } from "../confermation/confermation";

@Component({
  selector: 'app-list-users-component',
  imports: [ConfirmComponent, RouterLink, Loading, Confermation],
  templateUrl: './list-users-component.html',
  styleUrl: './list-users-component.css',
})
export class ListUsersComponent {
  @Input() users!: DiscoverModel[];
  url = environment.apiUrl;
  discoverService = inject(DiscoverService);
  showConfermation = signal(false);
  selectedUser = signal<DiscoverModel | null>(null)
  toggleSubscribe(user: DiscoverModel) {
    this.users = this.users.map(u => {
      if (u.id === user.id) {
        return { ...u, followed: !user.followed }
      }
      return u;
    })

  }


  follow(user: DiscoverModel) {
    this.discoverService.subscribe(user.id).subscribe({
      next: () => {
        this.toggleSubscribe(user)
      }
    })
  }

  unfollow(user: DiscoverModel) {
    this.selectedUser.set(user);
    this.showConfermation.set(true);
  }
  confermation(confirmed: boolean) {
    this.showConfermation.set(false);
    if (!confirmed) {
      return
    }
    if (this.selectedUser() !== null) {
      this.follow(this.selectedUser()!)
    }
  }



  searche(keyword: string) {
    if (!keyword.trim()) {
      this.discoverService.getUsers().subscribe({
        next: res => {
          this.users = res.data;
        }
      })
      return
    }
    this.discoverService.serche(keyword).subscribe({
      next: res => {
        this.users = res.data;
      }
    })
  }

  goToProfile(user: DiscoverModel | null) {
    if (user !== null) {
      console.log('Go to profile', user.name);
    }
  }
}
