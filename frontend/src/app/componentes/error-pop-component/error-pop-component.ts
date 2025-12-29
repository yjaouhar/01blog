import { ChangeDetectorRef, Component, EventEmitter, inject, input, Output } from '@angular/core';
import { ErrorePopService } from '../../services/errore-pop.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-pop-component',
  imports: [CommonModule],
  templateUrl: './error-pop-component.html',
  styleUrl: './error-pop-component.css',
})
export class ErrorPopComponent {
  errorPopService = inject(ErrorePopService);
  closeErrorPopup() {
    this.errorPopService.hideError();
  }

}
