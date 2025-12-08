import { Component, Input } from '@angular/core';
import { PostModel } from '../../model/post.model';
import { EditePostComponent } from "../edite-post-component/edite-post-component";
import { ConfirmComponent } from "../confirm-component/confirm-component";
import { ReportComponent } from "../report-component/report-component";

@Component({
  selector: 'app-post-template-component',
  imports: [EditePostComponent, ConfirmComponent, ReportComponent],
  templateUrl: './post-template-component.html',
  styleUrl: './post-template-component.css',
})
export class PostTemplateComponent {
  @Input() post!: PostModel;

  deletPost(confirm: boolean) {
    console.log("delet the post : ", this.post.id);
  }
  reportPost(reason: string) {
    console.log("reasonr fot report post " + this.post.id + ": ", reason);

  }
}
