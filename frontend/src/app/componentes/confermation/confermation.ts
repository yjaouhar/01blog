import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confermation',
  imports: [],
  templateUrl: './confermation.html',
  styleUrl: './confermation.css',
})
export class Confermation {
  @Input() message!: string;
  @Output() react = new EventEmitter<boolean>();
  close() {
    this.react.emit(false)
  }
  confirm() {
    this.react.emit(true)
  }
}
