import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminPost } from '../../model/post.type';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { NotResorce } from "../not-resorce/not-resorce";
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-panle-postes',
  imports: [Bane, Confermation, RouterLink, NotResorce],
  templateUrl: './panle-postes.html',
  styleUrl: './panle-postes.css',
})
export class PanlePostes implements OnInit {
  adminService = inject(AdminService)
  utils = inject(UtilsService)
  loadingService = inject(LoadingService)
  postes = signal<AdminPost[]>([]);
  filteredPost = signal<AdminPost[]>([]);
  selectedPost = signal<AdminPost | null>(null)
  showDeletConfirmation = signal(false);
  showHideConfirmation = signal(false);
  showActiveConfirmation = signal(false);
  loadData = signal(false)
  stat = signal('');
  ngOnInit(): void {
    this.loadingService.show();
    this.adminService.getPostes().subscribe({
      next: res => {
        console.log("postes : ", res);
        this.postes.set(res.data);
        this.filteredPost.set(res.data)
        this.loadData.set(true)
        this.loadingService.hide();
      },
      error: err => {
        this.loadingService.hide()

        throw err
      }
    })
  }

  changeSelectedPost(post: AdminPost, type: string) {
    this.selectedPost.set(post);
    if (type === "hide") {
      this.showHideConfirmation.set(true)
    } else if (type === "delet") {
      this.showDeletConfirmation.set(true)
    } else {
      this.showActiveConfirmation.set(true)
    }
  }

  activePost(conferm: boolean) {
    this.showActiveConfirmation.set(false)
    if (conferm && this.selectedPost()) {
      this.loadingService.show();
      this.adminService.activePost(this.selectedPost()?.id!).subscribe({
        next: (res) => {

          this.postes.update(post => post.map(u => {
            if (u.id === this.selectedPost()?.id) {
              return { ...u, hide: false }
            }
            return u;
          }));
          this.refreshFilter()
          this.loadingService.hide();

        },
        error: err => {
          this.loadingService.hide()

          throw err
        }
      })
    }
  }
  hidePost(conferm: boolean) {
    this.showHideConfirmation.set(false);
    if (conferm && this.selectedPost()) {
      this.loadingService.show();
      this.adminService.banPost(this.selectedPost()!.id).subscribe({
        next: () => {
          this.postes.update(post => post.map(u => {
            if (u.id === this.selectedPost()?.id) {
              return { ...u, hide: true }
            }
            return u;
          }));
          this.refreshFilter()
          this.loadingService.hide();

        },
        error: err => {
          this.loadingService.hide()

          throw err
        }
      })
    }
  }
  deletPost(conferm: boolean) {
    this.showDeletConfirmation.set(false);
    if (conferm && this.selectedPost()) {
      this.loadingService.show();
      this.adminService.deletPost(this.selectedPost()!.id).subscribe({
        next: () => {
          this.postes.update(post => post.filter(u => u.id !== this.selectedPost()?.id));
          this.refreshFilter();
          this.loadingService.hide();

        },
        error: err => {
          this.loadingService.hide()

          throw err
        }
      })
    }
  }

  refreshFilter() {
    const status = this.stat();
    this.filterByStatus(status);
  }
  filterByStatus(event: string) {
    if (!event.trim()) {
      this.filteredPost.update(() => this.postes())
    } else {
      this.filteredPost.update(() => this.postes().filter(p => event === 'active' ? !p.hide : p.hide))
    }
    this.stat.set(event)


  }
}
