import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminPost, Post, PostModel } from '../../model/post.type';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";
import { CommentComponent } from "../comment-component/comment-component";
import { AppRoutes } from "../../app.routes";
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { NotResorce } from "../not-resorce/not-resorce";

@Component({
  selector: 'app-panle-postes',
  imports: [Bane, Confermation, RouterLink, NotResorce],
  templateUrl: './panle-postes.html',
  styleUrl: './panle-postes.css',
})
export class PanlePostes implements OnInit {
  adminService = inject(AdminService)
    utils = inject(UtilsService)
  postes = signal<AdminPost[] | null>(null);
  displayedPost = signal<Post | null>(null);
  selectedPost = signal<AdminPost | null>(null)
  showDeletConfirmation = signal(false);
  showHideConfirmation = signal(false);
  loadData = signal(false)
  ngOnInit(): void {
    this.adminService.getPostes().subscribe({
      next: res => {
        console.log("postes : ", res);
        this.postes.set(res.data);
        this.loadData.set(true)
      }
    })
  }

  changeSelectedPost(post: AdminPost, type: string) {
    this.selectedPost.set(post);
    if (type === "hide") {
      this.showHideConfirmation.set(true)
    } else if (type === "delet") {
      this.showDeletConfirmation.set(true)
    }
  }

  activePost(id: string) {

    this.adminService.activePost(id).subscribe({
      next: res => {
        console.log("poste actiive ", res);

      }
    })

  }
  hidePost(conferm: boolean) {
    this.showHideConfirmation.set(false);
    if (conferm && this.selectedPost()) {
      this.adminService.banPost(this.selectedPost()!.id).subscribe({
        next: res => {
          console.log("poste hide ", res);

        }
      })
    }
  }
  deletPost(conferm: boolean) {
    this.showDeletConfirmation.set(false);
    if (conferm && this.selectedPost()) {
      this.adminService.deletPost(this.selectedPost()!.id).subscribe({
        next: res => {
          console.log("poste deleted ", res);

        }
      })
    }
  }
}
