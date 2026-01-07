import { Component, EventEmitter, inject, Input, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Spinner } from "../spinner/spinner";
import { Success } from "../success/success";
import { PostService } from '../../services/post.service';
import { Refuse } from "../refuse/refuse";
import { throwError } from 'rxjs';

declare var bootstrap: any;
@Component({
  selector: 'app-report-component',
  imports: [ReactiveFormsModule, Spinner, Success, Refuse],
  templateUrl: './report-component.html',
  styleUrl: './report-component.css',
})
export class ReportComponent {
  form: FormGroup;
  @Input() id!: string;
  loading = signal(false);
  success = signal(false);
  refus = signal(false)
  postService = inject(PostService)
  showError = false;
  errorMessage = '';
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      userInput: ['']
    });
  }
  ngAfterViewInit() {
    const modalEl = document.getElementById('reportModel' + this.id);
    if (!modalEl) return;

    modalEl.addEventListener('hide.bs.modal', () => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
  inputChange() {
    this.refus.set(false);
    this.showError = false;
  }
  onSubmit() {
    const reason: string = this.form.value.userInput.trim();
    if (reason.length < 10) {
      this.errorMessage = 'Reason must be between 10 and 255 characters';
      this.showError = true;
      this.refus.set(true)
      return
    } else if (reason.length > 255) {
      this.errorMessage = 'The reason you submitted was too long, please submit something shorter'
      this.showError = true;
      this.refus.set(true)

      return
    }

    this.loading.set(true);
    // this.reason.emit(reason)
    if (!this.id) {
      this.errorMessage = 'The report could not be sent. Please try again.'
      this.showError = true;
      this.refus.set(true)

    }
    this.postService.reportPost(this.id, reason).subscribe({
      next: res => {
        this.loading.set(false);
        this.success.set(true)
      },
      error: err => {
        this.loading.set(false);
        this.refus.set(true)
        throw err;
      }
    })
    setTimeout(() => {
      const modalEl = document.getElementById('reportModel' + this.id);
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      this.loading.set(false);
      this.success.set(false);
      this.refus.set(false)
      this.form.reset();
    }, 2000)
  }
}
