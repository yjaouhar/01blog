import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-regester',
  imports: [],
  templateUrl: './regester.html',
  styleUrl: './regester.css',
})
export class Regester {
  valid = "is-valid"
  invalid = "is-invalid"
  firstName = signal("")
  lastName = signal("")
  validName(input: string) {
    console.log("---> " , input);
    
    return input.length>4 ? this.valid : this.invalid
  }
}
