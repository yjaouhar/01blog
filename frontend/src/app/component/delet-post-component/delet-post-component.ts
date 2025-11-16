import { Component } from '@angular/core';

@Component({
  selector: 'app-delet-post-component',
  imports: [],
  templateUrl: './delet-post-component.html',
  styleUrl: './delet-post-component.css',
})
export class DeletPostComponent {
  confirmDelete() {
    console.log("Post deleted.");
    // hit service here
  }
}
