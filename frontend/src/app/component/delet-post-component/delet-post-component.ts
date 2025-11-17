import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-delet-post-component',
  imports: [],
  templateUrl: './delet-post-component.html',
  styleUrl: './delet-post-component.css',
})
export class DeletPostComponent {
  @Input() postId: number | null = null;

  confirmDelete() {
    console.log("Post deleted.", this.postId);
  }
}
