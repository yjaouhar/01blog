import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { PosteComponent } from '../../componentes/poste.component/poste-component';
declare var bootstrap: any;
@Component({
  selector: 'app-hom.page',
  imports: [PosteComponent],
  templateUrl: './hom.page.html',
  styleUrl: './hom.page.css',
})
export class HomPage {
  homeService = inject(HomeService)
  postes = signal(this.homeService.getPodteData())

}
