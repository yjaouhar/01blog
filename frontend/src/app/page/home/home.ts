import { Component, inject, signal } from '@angular/core';
import { PosteComponent } from "../../component/poste-component/poste-component";
import { PosteServices } from '../../services/poste.services';
import { PostModel } from '../../model/poste-model';
import { CommentComponent } from "../../component/comment-component/comment-component";
import { HomeDirectives } from '../../directives/home-directives';

@Component({
  selector: 'app-home',
  imports: [PosteComponent, CommentComponent ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  postServices = inject(PosteServices)
  postes = signal<PostModel[]>(this.postServices.getPodteData());


}
