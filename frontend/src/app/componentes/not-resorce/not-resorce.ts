import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-resorce',
  imports: [],
  templateUrl: './not-resorce.html',
  styleUrl: './not-resorce.css',
})
export class NotResorce {

  @Input() message!: string;
  @Input() type!: string;
}
