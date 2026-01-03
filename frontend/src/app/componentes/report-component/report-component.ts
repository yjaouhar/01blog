import { Component, EventEmitter, Input, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

declare var bootstrap: any;
@Component({
  selector: 'app-report-component',
  imports: [ReactiveFormsModule,],
  templateUrl: './report-component.html',
  styleUrl: './report-component.css',
})
export class ReportComponent {
  form: FormGroup;
  @Input() id!: string;
  @Output() reason = new EventEmitter<string>()
  loading = signal(true);
  success = signal(true);
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
    this.showError = false;
  }
  onSubmit() {
    this.loading.set(true);
    this.success.set(true);
    const reason: string = this.form.value.userInput.trim();
    if (reason.length < 10) {
      this.errorMessage = 'Reason must be between 10 and 255 characters';
      this.showError = true;
      return
    } else if (reason.length > 255) {
      this.errorMessage = 'The reason you submitted was too long, please submit something shorter'
      this.showError = true;
      return
    }

    this.reason.emit(reason)

    // const modalEl = document.getElementById('reportModel' + this.id);
    // const modal = bootstrap.Modal.getInstance(modalEl);
    // modal.hide();
  }
}
