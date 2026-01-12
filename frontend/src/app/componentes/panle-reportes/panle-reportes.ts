import { Component, inject, OnInit, signal } from '@angular/core';
import { Reports } from '../../model/reportes.type';
import { AdminService } from '../../services/admin.service';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";
import { UtilsService } from '../../services/utils.service';
import { NotResorce } from "../not-resorce/not-resorce";
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { RouterLink } from '@angular/router';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-panle-reportes',
  imports: [Bane, Confermation, NotResorce, CommonModule, RouterLink],
  templateUrl: './panle-reportes.html',
  styleUrl: './panle-reportes.css',
})
export class PanleReportes implements OnInit {

  adminService = inject(AdminService);
  reportService = inject(ReportService);
  loadingService = inject(LoadingService)
  utils = inject(UtilsService)
  showDeletConfirmation = signal(false);
  showHideConfirmation = signal(false);
  selectedTarget = signal<Reports | null>(null);
  reports = signal<Reports[]>([])
  loadData = signal(false)
  ngOnInit(): void {
    this.loadingService.show();
    this.reportService.getReports().subscribe({
      next: res => {
        this.reports.set(res.data)
        this.loadData.set(true)
        this.loadingService.hide();

      },
      error: err => {
        this.loadingService.hide()

        throw err
      }
    })
  }

  changeSelectedPost(report: Reports, type: string) {
    this.selectedTarget.set(report);
    if (type === "hide") {
      this.showHideConfirmation.set(true)
    } else if (type === 'delet') {
      this.showDeletConfirmation.set(true)
    } else {
      this.reject()
    }
  }

  banTarget(conferm: boolean) {
    this.showHideConfirmation.set(false)
    if (conferm && this.selectedTarget()) {
      this.loadingService.show();
      const request = {
        reportId: this.selectedTarget()?.id!,
        remove: false,
        status: true,
      }
      this.reportService.react(request).subscribe({
        next: res => {
          this.resolved()
          this.loadingService.hide();
        },
        error: err => {
          this.loadingService.hide()

          throw err
        }
      })

    }

  }
  deleteTarget(conferm: boolean) {
    this.showDeletConfirmation.set(false)
    if (conferm && this.selectedTarget()) {
      this.loadingService.show();
      const request = {
        reportId: this.selectedTarget()?.id!,
        remove: true,
        status: true,
      }
      this.reportService.react(request).subscribe({
        next: res => {
          this.resolved()
          this.loadingService.hide();
        },
        error: err => {
          this.loadingService.hide()

          throw err
        }
      })
    }
  }
  reject() {
    this.loadingService.show();
    const request = {
      reportId: this.selectedTarget()?.id!,
      remove: false,
      status: false,
    }
    this.reportService.react(request).subscribe({
      next: res => {
        this.resolved()
        this.loadingService.hide();
      },
      error: err => {
        this.loadingService.hide()

        throw err
      }
    })
  }

  resolved() {
    this.reports.update(arr => arr.map(r => {
      if (r.id === this.selectedTarget()?.id) {
        return { ...r, status: "RESOLVED" }
      }
      return r;
    }))
  }

}
