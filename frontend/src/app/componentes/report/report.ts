import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Spinner } from "../spinner/spinner";
import { Success } from "../success/success";
import { Refuse } from "../refuse/refuse";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { ProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-report',
  imports: [Spinner, Success, Refuse, ReactiveFormsModule],
  templateUrl: './report.html',
  styleUrl: './report.css',
})
export class Report {
  @Input() id!: string
  @Output() hide = new EventEmitter()
  profileService = inject(ProfileService)
  loading = signal(false);
  success = signal(false);
  refus = signal(false)

  form = new FormGroup({
    userInput: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(255)])
  })
  close() {
    this.hide.emit()
  }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    this.loading.set(true);
    this.profileService.reportUser(this.id, this.form.value.userInput ?? '').subscribe({
      next: res => {
        this.loading.set(false);
        this.success.set(true)
      },
      error: err => {
        this.loading.set(false);
        this.refus.set(true)
        throw err;
      },
      complete: () => {
        this.close()
      }
    })
  }
}
