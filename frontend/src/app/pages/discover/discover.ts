import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../model/discover.type';
import { DiscoverService } from '../../services/discover.service';
import { ListUsersComponent } from "../../componentes/list-users-component/list-users-component";
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-discover',
  imports: [ListUsersComponent],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover implements OnInit {
  discoverServices = inject(DiscoverService)
  loadingService = inject(LoadingService)
  users = signal<User[]>([]);
  loadUSers = signal(false)
  ngOnInit(): void {
    this.loadingService.show
    this.discoverServices.getUsers().subscribe({
      next: res => {
        this.users.set(res.data ?? []);
        this.loadUSers.set(true)
      },
      complete: () => {
        this.loadingService.hide()
      }
    })
  }

}
