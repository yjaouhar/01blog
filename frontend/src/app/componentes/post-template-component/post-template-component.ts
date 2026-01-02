import { Component, EventEmitter, inject, Input, output, Output, signal } from '@angular/core';
import { Post, PostModel } from '../../model/post.type';
import { EditePostComponent } from "../edite-post-component/edite-post-component";
import { ConfirmComponent } from "../confirm-component/confirm-component";
import { ReportComponent } from "../report-component/report-component";
import { UtilsService } from '../../services/utils.service';
import { environment } from '../../../environments/enveronment';
import { PostService } from '../../services/post.service';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-post-template-component',
  imports: [EditePostComponent, ConfirmComponent, ReportComponent],
  templateUrl: './post-template-component.html',
  styleUrl: './post-template-component.css',
})
export class PostTemplateComponent {
  @Input() post: Post | null = null;
  utils = inject(UtilsService);
  postService = inject(PostService);
  url = environment.apiUrl;
  @Output() remove = new EventEmitter<string>();
  deletPost() {
    if (!this.post) return;
    this.postService.deletPost(this.post.id).subscribe({
      next: res => {
        console.log("post deleted : ", res);
        this.remove.emit(this.post?.id);
        // this.post = null;
      }
    });
  }
  reportPost(reason: string) {
    if (!this.post) return;
    console.log("reason for report post " + this.post.id + ": ", reason);

  }
  active(index: number) {
    if (index === 0) {
      return "active"
    }
    return ""
  }
}
