import { Component, EventEmitter, Input, Output } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-confirm-component',
  imports: [],
  templateUrl: './confirm-component.html',
  styleUrl: './confirm-component.css',
})
export class ConfirmComponent {
  @Input() id!: string;
  @Input() message!: string;
  @Output() conferm = new EventEmitter<boolean>()

  ngAfterViewInit() {
    const modalEl = document.getElementById('confermModal' + this.id);
    if (!modalEl) return;

    modalEl.addEventListener('hide.bs.modal', () => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
  confirmDelete() {
    this.conferm.emit(true)
    const modalEl = document.getElementById('confermModal' + this.id);
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  }
}
