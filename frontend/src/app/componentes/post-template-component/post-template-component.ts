import { Component, EventEmitter, inject, Input, output, Output, signal } from '@angular/core';
import { Post } from '../../model/post.type';
import { EditePostComponent } from "../edite-post-component/edite-post-component";
import { ConfirmComponent } from "../confirm-component/confirm-component";
import { ReportComponent } from "../report-component/report-component";
import { UtilsService } from '../../services/utils.service';
import { environment } from '../../../environments/enveronment';
import { PostService } from '../../services/post.service';
import { EMPTY } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { Confermation } from '../confermation/confermation';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-template-component',
  imports: [EditePostComponent, ReportComponent, Confermation, CommonModule],
  templateUrl: './post-template-component.html',
  styleUrl: './post-template-component.css',
})
export class PostTemplateComponent {
  @Input() post: Post | null = null;
  utils = inject(UtilsService);
  postService = inject(PostService);
  loadingService = inject(LoadingService)
  authService = inject(AuthService)
  showConfermation = signal(false)
  showReport = signal(false)
  shoeEdit = signal(false)
  url = environment.apiUrl;
  @Output() remove = new EventEmitter<string>();
  deletPost(event: boolean) {
    if (!this.post) return;
    this.showConfermation.set(false)
    if (!event) {
      return
    }
    this.loadingService.show()
    this.postService.deletPost(this.post.id).subscribe({
      next: res => {
        console.log("post deleted : ", res);
        this.remove.emit(this.post?.id);
        this.loadingService.hide()
      }
    });
  }
  showDelet() {
    console.log("$");

    this.showConfermation.set(true)
  }
  active(index: number) {
    if (index === 0) {
      return "active"
    }
    return ""
  }
}
