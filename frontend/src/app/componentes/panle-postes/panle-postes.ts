import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminPost, Post, PostModel } from '../../model/post.type';
import { Bane } from "../bane/bane";
import { Confermation } from "../confermation/confermation";
import { CommentComponent } from "../comment-component/comment-component";

@Component({
  selector: 'app-panle-postes',
  imports: [Bane, Confermation, CommentComponent],
  templateUrl: './panle-postes.html',
  styleUrl: './panle-postes.css',
})
export class PanlePostes implements OnInit {
  adminService = inject(AdminService)
  postes = signal<PostModel<AdminPost> | null>(null);
  showPost = signal(false)
  displayedPost = signal<Post | null>(null);
  selectedPost = signal<AdminPost | null>(null)
  showDeletConfirmation = signal(false);
  showHideConfirmation = signal(false);
  ngOnInit(): void {
    this.adminService.getPostes().subscribe({
      next: res => {
        console.log("postes : ", res);
        this.postes.set(res.data);
      }
    })
  }
  clos() {
    this.showPost.set(false)
  }
  viewpost(postId: string) {
    this.adminService.getPoste(postId).subscribe({
      next: res => {
        console.log("reseve post : ", res);
        this.displayedPost.set(res.data)
        if (this.displayedPost()) {
          this.showPost.set(true)
        }

      }
    })
  }
  changeSelectedPost(post: AdminPost, type: string) {
    this.selectedPost.set(post);
    if (type === "hide") {
      this.showHideConfirmation.set(true)
    } else {
      this.showDeletConfirmation.set(true)
    }
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
