import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-bane',
  imports: [],
  templateUrl: './bane.html',
  styleUrl: './bane.css',
})
export class Bane {
  @Input() message!: string;
  @Output() react = new EventEmitter<boolean>();
  close() {
    this.react.emit(false)
  }
  confirm() {
    this.react.emit(true)
  }
}
