import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-error-pop-component',
  imports: [],
  templateUrl: './error-pop-component.html',
  styleUrl: './error-pop-component.css',
})
export class ErrorPopComponent {

  @Output() conf = new EventEmitter<boolean>();
  message = input<string>('');


  closeErrorPopup() {
    this.conf.emit(true);
  }

}
