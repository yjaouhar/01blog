import { Component, inject, OnInit, signal } from '@angular/core';
import { Reports } from '../../model/reportes.type';
import { AdminService } from '../../services/admin.service';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";

@Component({
  selector: 'app-panle-reportes',
  imports: [Bane, Confermation],
  templateUrl: './panle-reportes.html',
  styleUrl: './panle-reportes.css',
})
export class PanleReportes implements OnInit {

  adminService = inject(AdminService);
  showDeletConfirmation = signal(false);
  showHideConfirmation = signal(false);
  selectedTarget = signal<Reports | null>(null);
  reports = signal<Reports[] | null>(null)
  ngOnInit(): void {
    this.adminService.getReports().subscribe({
      next: res => {
        this.reports.set(res.data)
      }
    })
  }
  changeSelectedPost(report: Reports, type: string) {
    this.selectedTarget.set(report);
    if (type === "hide") {
      this.showHideConfirmation.set(true)
    } else {
      this.showDeletConfirmation.set(true)
    }
  }

  banTarget(conferm: boolean) {
    this.showHideConfirmation.set(false)

    if (conferm && this.selectedTarget()) {
      if (this.selectedTarget()?.type === 'post') {
        this.adminService.banPost(this.selectedTarget()!.id).subscribe({
          next: res => {
            console.log("bane Post : ", res);
          }
        })
      } else if (this.selectedTarget()?.type === 'user') {
        this.adminService.banUser(this.selectedTarget()!.id).subscribe({
          next: res => {
            console.log("bane user : ", res);
          }
        })
      }
    }

  }
  deleteTarget(conferm: boolean) {
    this.showDeletConfirmation.set(false)
    if (conferm && this.selectedTarget()) {
      if (this.selectedTarget()?.type === 'post') {
        this.adminService.deletPost(this.selectedTarget()!.id).subscribe({
          next: res => {
            console.log("removed Post : ", res);
          }
        })
      } else if (this.selectedTarget()?.type === 'user') {
        this.adminService.deletUser(this.selectedTarget()!.id).subscribe({
          next: res => {
            console.log("removed user : ", res);
          }
        })
      }
    }
  }
  removeReport(id: string) {
    this.adminService.deletReport(id).subscribe({
      next: res => {
        console.log("===> report removed ", res);
      }
    })
  }
}
