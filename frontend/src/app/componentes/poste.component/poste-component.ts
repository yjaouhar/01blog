import { Component, Input } from '@angular/core';
import { PostModel } from '../../model/post.model';

@Component({
  selector: 'app-poste-component',
  imports: [],
  templateUrl: './poste-component.html',
  styleUrl: './poste-component.css',
})
export class PosteComponent {

  @Input() postes!: PostModel[];
}
