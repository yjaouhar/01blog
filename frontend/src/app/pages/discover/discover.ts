import { Component, inject, signal } from '@angular/core';
import { DiscoverModel } from '../../model/discover.type';
import { DiscoverService } from '../../services/discover.service';

import { ListUsersComponent } from "../../componentes/list-users-component/list-users-component";

@Component({
  selector: 'app-discover',
  imports: [ListUsersComponent],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover {
  discoverServices = inject(DiscoverService)
  users = signal<DiscoverModel[]>(this.discoverServices.getUsers());

}
