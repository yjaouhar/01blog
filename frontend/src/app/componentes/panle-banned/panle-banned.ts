import { Component, inject, signal } from '@angular/core';
import { Baned } from '../../model/reportes.type';
import { AdminService } from '../../services/admin.service';
import { Confermation } from "../confermation/confermation";

@Component({
  selector: 'app-panle-banned',
  imports: [Confermation],
  templateUrl: './panle-banned.html',
  styleUrl: './panle-banned.css',
})
export class PanleBanned {

  adminService = inject(AdminService);
  showConfirmation = signal(false);
  selectTarget = signal<Baned | null>(null);
  banned = [
    { id: '1', type: 'user', name: 'badUser97', date: '23 Oct' },
    { id: '2', type: 'post', name: 'Post #32', date: '21 Oct' },
  ];

  openConfirmation(target: Baned) {
    this.selectTarget.set(target);
    this.showConfirmation.set(true);
  }

  deletTarget(conferm: boolean) {
    this.showConfirmation.set(false)
    if (conferm && this.selectTarget()) {
      if (this.selectTarget()?.type === 'post') {
        this.adminService.deletPost(this.selectTarget()!.id).subscribe({
          next: res => {
            console.log("poste delet ", res);

          }
        })
      } else if (this.selectTarget()?.type === 'user') {
        this.adminService.deletUser(this.selectTarget()!.id).subscribe({
          next: res => {
            console.log("user delet ", res);

          }
        })
      }
    }
  }
  relaveTarget() {
    if (this.selectTarget()) {
      if (this.selectTarget()?.type === 'post') {
        this.adminService.deletPost(this.selectTarget()!.id).subscribe({
          next: res => {
            console.log("poste delet ", res);

          }
        })
      } else if (this.selectTarget()?.type === 'user') {
        this.adminService.deletUser(this.selectTarget()!.id).subscribe({
          next: res => {
            console.log("user delet ", res);

          }
        })
      }
    }
  }
}
