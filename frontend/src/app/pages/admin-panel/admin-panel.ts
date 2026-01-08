import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Stats } from '../../model/reportes.type';
import { Spinner } from "../../componentes/spinner/spinner";
import { PanleUseres } from "../../componentes/panle-useres/panle-useres";
import { PanlePostes } from "../../componentes/panle-postes/panle-postes";
import { PanleReportes } from "../../componentes/panle-reportes/panle-reportes";


@Component({
  selector: 'app-admin-panel',
  imports: [Spinner, PanleUseres, PanlePostes, PanleReportes],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  tab = signal('users');
  adminService = inject(AdminService)
  stats = signal<Stats | null>(null)
  loadData = signal(false)

  ngOnInit(): void {
    this.adminService.stats().subscribe({
      next: res => {
        this.stats.set(res.data)
        this.loadData.set(true)
      }
    })
  }
}
