import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { DiscoverModel, User } from '../../model/discover.type';
import { ConfirmComponent } from '../confirm-component/confirm-component';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/enveronment';
import { Loading } from "../loading/loading";
import { DiscoverService } from '../../services/discover.service';
import { Confermation } from "../confermation/confermation";
import { UtilsService } from '../../services/utils.service';
import { NotResorce } from "../not-resorce/not-resorce";
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-list-users-component',
  imports: [RouterLink, Confermation, NotResorce],
  templateUrl: './list-users-component.html',
  styleUrl: './list-users-component.css',
})
export class ListUsersComponent {
  @Input() users: DiscoverModel | null = null;
  @Input() loadData = false;
  @Input() showSercheBare = false;
  url = environment?.apiUrl;
  discoverService = inject(DiscoverService);
  loadingService = inject(LoadingService)
  utils = inject(UtilsService);
  showConfermation = signal(false);
  selectedUser = signal<User | null>(null)
  serched = signal(false);
  toggleSubscribe(user: User) {
    this.users!.data = this.users!.data.map(u => {
      if (u.id === user.id) {
        return { ...u, followed: !user.followed }
      }
      return u;
    })
  }


  follow(user: User) {
    this.loadingService.show();
    this.discoverService.subscribe(user.id).subscribe({
      next: () => {
        this.toggleSubscribe(user)
      },
      complete: () => {
        this.loadingService.hide()
      }
    })
  }

  unfollow(user: User) {
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
    this.loadData = false;
    this.serched.set(true)
    this.loadingService.show()
    if (!keyword.trim()) {
      this.discoverService.getUsers().subscribe({
        next: res => {
          this.users = res.data;
          this.loadingService.hide()
        }
      })
      return
    }
    this.discoverService.serche(keyword).subscribe({
      next: res => {
        this.users = res.data;
        this.loadingService.hide()
      }
    })
  }

}
