import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-post-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-post-component.html',
  styleUrl: './report-post-component.css',
})
export class ReportPostComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      userInput: ['']
    });
  }

  onSubmit() {
    console.log("Report reason:", this.form.value.userInput);
  }
}
