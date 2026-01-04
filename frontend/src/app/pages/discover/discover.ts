import { Component, inject, OnInit, signal } from '@angular/core';
import { DiscoverModel } from '../../model/discover.type';
import { DiscoverService } from '../../services/discover.service';

import { ListUsersComponent } from "../../componentes/list-users-component/list-users-component";
import { NotResorce } from "../../componentes/not-resorce/not-resorce";

@Component({
  selector: 'app-discover',
  imports: [ListUsersComponent, NotResorce],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover implements OnInit {
  discoverServices = inject(DiscoverService)
  users = signal<DiscoverModel[]>([]);
  ngOnInit(): void {
    this.discoverServices.getUsers().subscribe({
      next: res => {
        if (res?.data) {
          console.log("------> " , res.data);
          
          this.users.set(res.data);
        }
      }
    })
  }

}
