import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { PosteComponent } from '../../componentes/poste.component/poste-component';
import { ErrorPopComponent } from "../../componentes/error-pop-component/error-pop-component";
declare var bootstrap: any;
@Component({
  selector: 'app-hom.page',
  imports: [PosteComponent, ErrorPopComponent],
  templateUrl: './hom.page.html',
  styleUrl: './hom.page.css',
})
export class HomPage {
  homeService = inject(HomeService)
  postes = signal(this.homeService.getPodteData())

}
