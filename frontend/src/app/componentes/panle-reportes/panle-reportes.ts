import { Component, inject, OnInit, signal } from '@angular/core';
import { Reports } from '../../model/reportes.type';
import { AdminService } from '../../services/admin.service';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";
import { UtilsService } from '../../services/utils.service';
import { NotResorce } from "../not-resorce/not-resorce";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panle-reportes',
  imports: [Bane, Confermation, NotResorce, CommonModule],
  templateUrl: './panle-reportes.html',
  styleUrl: './panle-reportes.css',
})
export class PanleReportes implements OnInit {

  adminService = inject(AdminService);
  utils = inject(UtilsService)
  showDeletConfirmation = signal(false);
  showHideConfirmation = signal(false);
  selectedTarget = signal<Reports | null>(null);
  reports = signal<Reports[] | null>(null)
  loadData = signal(false)
  ngOnInit(): void {
    this.adminService.getReports().subscribe({
      next: res => {
        this.reports.set(res.data)
        this.loadData.set(true)
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

}
