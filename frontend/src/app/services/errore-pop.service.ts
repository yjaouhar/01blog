import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorePopService {

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();
  loadingService = inject(LoadingService)
  showError(message: string) {
    this.errorSubject.next(message);

    setTimeout(() => {
      this.hideError();
      this.loadingService.hide()
    }, 5000);
  }
  hideError() {
    this.errorSubject.next(null);
  }
}
