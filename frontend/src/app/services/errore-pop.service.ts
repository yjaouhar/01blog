import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorePopService {

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  showError(message: string) {
    console.log('SHOW INSTANCE', this);
    this.errorSubject.next(message);

    setTimeout(() => {
      this.hideError();
    }, 4000);
  }
  hideError() {
    console.log('+/+/+/+/');
    this.errorSubject.next(null);
  }
}
