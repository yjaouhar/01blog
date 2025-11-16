import { Component, inject, signal } from '@angular/core';
import { PosteServices } from '../../services/poste.services';
import { PostModel } from '../../model/poste-model';
import { PosteComponent } from "../../component/poste-component/poste-component";

@Component({
  selector: 'app-home',
  imports: [PosteComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  postServices = inject(PosteServices)
  postes = signal<PostModel[]>(this.postServices.getPodteData());


}
