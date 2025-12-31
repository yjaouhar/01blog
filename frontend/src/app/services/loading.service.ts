import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean | null>(null);
  loading$ = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }
  hide() {
    this.loadingSubject.next(null);
  }
}
