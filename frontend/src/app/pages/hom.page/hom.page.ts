import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { PosteComponent } from '../../componentes/poste.component/poste-component';
@Component({
  selector: 'app-hom.page',
  imports: [PosteComponent],
  templateUrl: './hom.page.html',
  styleUrl: './hom.page.css',
})
export class HomPage   {
  loding = signal(true);
  // ngOnInit(): void {
  //   debugger;
  //   return
  //   console.log("dd #########");
  //   // this.loding.set(false);
  // }
  homeService = inject(HomeService)
  postes = signal(this.homeService.getPodteData())

}
