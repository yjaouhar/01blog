import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DiscoverModel, User } from '../../model/discover.type';
import { DiscoverService } from '../../services/discover.service';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";
import { AdminService } from '../../services/admin.service';
import { Users } from '../../model/reportes.type';
import { environment } from '../../../environments/enveronment';
import { UtilsService } from '../../services/utils.service';
import { NotResorce } from "../not-resorce/not-resorce";
import { Spinner } from "../spinner/spinner";

@Component({
  selector: 'app-panle-useres',
  imports: [RouterLink, Bane, Confermation, NotResorce],
  templateUrl: './panle-useres.html',
  styleUrl: './panle-useres.css',
})
export class PanleUseres implements OnInit {
  adminService = inject(AdminService)
  utils = inject(UtilsService)
  users = signal<Users[] | null>(null);
  selectedUser = signal<Users | null>(null)
  showDeletConfirmatiom = signal(false);
  showBanConfirmatiom = signal(false)
  loadData = signal(false)
  url = environment.apiUrl;
  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: res => {
        this.users.set(res.data)
        this.loadData.set(true)
      }
    })
  }
  selectBaneUser(user: Users) {
    this.showBanConfirmatiom.set(true)
    this.selectedUser.set(user)
  }
  selectDeletUser(user: Users) {
    this.showDeletConfirmatiom.set(true)
    this.selectedUser.set(user)
  }
  activeUser(user: Users) {
    console.log("user activat :");
    this.adminService.activeUser(user.id).subscribe({
      next: res => {
        console.log("user activat :", res);

      }
    })
  }
  banUser(conferm: boolean) {
    this.showBanConfirmatiom.set(false)
    console.log(conferm);
    
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
