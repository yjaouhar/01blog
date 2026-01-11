import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";
import { AdminService } from '../../services/admin.service';
import { Users } from '../../model/reportes.type';
import { environment } from '../../../environments/enveronment';
import { UtilsService } from '../../services/utils.service';
import { NotResorce } from "../not-resorce/not-resorce";
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-panle-useres',
  imports: [RouterLink, Bane, Confermation, NotResorce],
  templateUrl: './panle-useres.html',
  styleUrl: './panle-useres.css',
})
export class PanleUseres implements OnInit {
  adminService = inject(AdminService)
  utils = inject(UtilsService)
  loadingService = inject(LoadingService)
  users = signal<Users[]>([]);
  filteredUser = signal<Users[]>(this.users());
  selectedUser = signal<Users | null>(null)
  showDeletConfirmatiom = signal(false);
  showBanConfirmatiom = signal(false)
  loadData = signal(false)
  stat = signal('');
  url = environment.apiUrl;
  ngOnInit(): void {
    this.loadingService.show();
    this.adminService.getUsers().subscribe({
      next: res => {
        this.users.set(res.data)
        this.filteredUser.set(res.data)
        this.loadData.set(true)
        this.loadingService.hide();

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
  activeUser(usere: Users) {
    this.loadingService.show();
    this.adminService.activeUser(usere.id).subscribe({
      next: () => {
        this.users.update(user => user.map(u => {
          if (u.id === usere.id) {
            return { ...u, status: true }
          }
          return u;
        }));
        this.refreshFilter()
        this.loadingService.hide();


      }
    })
  }
  banUser(conferm: boolean) {
    this.showBanConfirmatiom.set(false)
    if (conferm && this.selectedUser()) {
      this.loadingService.show();
      this.adminService.banUser(this.selectedUser()!.id).subscribe({
        next: () => {
          this.users.update(user => user.map(u => {
            if (u.id === this.selectedUser()?.id) {
              return { ...u, status: false }
            }
            return u;
          }));
          this.refreshFilter()
          this.loadingService.hide();

        }
      })
    }
  }
  deleteUser(conferm: boolean) {
    this.showDeletConfirmatiom.set(false)
    if (conferm && this.selectedUser()) {
      this.loadingService.show();
      this.adminService.deletUser(this.selectedUser()!.id).subscribe({
        next: () => {
          this.users.update(user => user.filter(u => u.id !== this.selectedUser()?.id));
          this.refreshFilter();
          this.loadingService.hide();
        }
      })
    }
  }

  refreshFilter() {
    const status = this.stat();
    this.filterByStatus(status);
  }
  filterByStatus(event: string) {
    console.log("----> stat : ", event);

    if (!event.trim()) {
      this.filteredUser.update(() => this.users())
    } else {
      this.filteredUser.update(() => this.users().filter(u => event === 'active' ? u.status : !u.status))
    }
    this.stat.set(event)


  }
}
