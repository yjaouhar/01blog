import { Component, Input } from '@angular/core';
import { DiscoverModel } from '../../model/discover.type';
import { AppRoutes } from "../../app.routes";
import { ConfirmComponent } from '../confirm-component/confirm-component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-users-component',
  imports: [ConfirmComponent, RouterLink,],
  templateUrl: './list-users-component.html',
  styleUrl: './list-users-component.css',
})
export class ListUsersComponent {
  @Input() users!: DiscoverModel[];

  toggleSubscribe(user: DiscoverModel) {


    this.users = this.users.map(u => {
      if (u.id === user.id) {
        return { ...u, subscribed: !user.subscribed }
      }
      return u;
    })

  }


  follow(user: DiscoverModel) {
    this.toggleSubscribe(user)
  }
  confermation(confirmed: boolean, user: DiscoverModel) {
    console.log("confirmation ==> ", confirmed);
    if (!confirmed) {
      return
    }

    this.toggleSubscribe(user)

  }
  searche(v: string) {
    console.log("searche : ", v);

  }

  goToProfile(user: DiscoverModel | null) {
    if (user !== null) {
      console.log('Go to profile', user.name);
    }
  }
}
