import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-post-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-post-component.html',
  styleUrl: './report-post-component.css',
})
export class ReportPostComponent {
  form: FormGroup;
  @Input() postId!: number;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      userInput: ['']
    });
  }

  onSubmit() {
    console.log("Report for post : " + this.postId + " reason: ", this.form.value.userInput);
  }
}
