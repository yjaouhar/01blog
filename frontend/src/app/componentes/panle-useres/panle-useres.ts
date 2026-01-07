import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DiscoverModel, User } from '../../model/discover.type';
import { DiscoverService } from '../../services/discover.service';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-panle-useres',
  imports: [RouterLink, Bane, Confermation],
  templateUrl: './panle-useres.html',
  styleUrl: './panle-useres.css',
})
export class PanleUseres implements OnInit {
  adminService = inject(AdminService)
  users = signal<DiscoverModel | null>(null);
  selectedUser = signal<User | null>(null)
  showDeletConfirmatiom = signal(false);
  showBanConfirmatiom = signal(false)
  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: res => {
        this.users.set(res.data)
      }
    })
  }
  selectBaneUser(user: User) {
    this.showBanConfirmatiom.set(true)
    this.selectedUser.set(user)
  }
  selectDeletUser(user: User) {
    this.showDeletConfirmatiom.set(true)
    this.selectedUser.set(user)
  }
  banUser(conferm: boolean) {
    this.showBanConfirmatiom.set(false)
    if (conferm && this.selectedUser()) {
      this.adminService.banUser(this.selectedUser()!.id).subscribe({
        next: res => {
          console.log("user bane :", res);

        }
      })
    }
  }
  deleteUser(conferm: boolean) {
    this.showDeletConfirmatiom.set(false)
    if (conferm && this.selectedUser()) {
      this.adminService.deletUser(this.selectedUser()!.id).subscribe({
        next: res => {
          console.log("user deleted :", res);

        }
      })
    }
  }

}
