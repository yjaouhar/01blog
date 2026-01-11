import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../model/post.type';
import { NotResorce } from "../../componentes/not-resorce/not-resorce";
import { PosteComponent } from "../../componentes/poste.component/poste-component";

@Component({
  selector: 'app-poste',
  imports: [ NotResorce, PosteComponent],
  templateUrl: './poste.html',
  styleUrl: './poste.css',
})
export class Poste implements OnInit {

   route = inject(ActivatedRoute);
  postService = inject(PostService);
  postId = signal('')
  resevData = signal(false);
  poste = signal<Post[]>([])

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.postId.set(params.get('postId') ?? '')
    });
    this.postService.getPoste(this.postId()).subscribe({
      next: res => {        
        this.poste.set([res.data]);
      },
      error: err => {
        this.resevData.set(true)
        throw err
      },
      complete: () => {
        this.resevData.set(true)
      }

    });

  }


}