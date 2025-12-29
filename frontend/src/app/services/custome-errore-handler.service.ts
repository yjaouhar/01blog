import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ErrorePopService } from './errore-pop.service';

@Injectable({
  providedIn: 'root',
})
export class CustomeErroreHandlerService implements ErrorHandler {

  errorPoopService = inject(ErrorePopService);

  handleError(error: any): void {
    // console.log('==> Custom Error Handler:', error);
    if (error?.status === 401) {
      this.errorPoopService.showError('Session سالات، عاود دخل ' );
    } else if (error?.status === 500) {
      this.errorPoopService.showError('مشكل فالسيرفر ' );
    } else {
      this.errorPoopService.showError('وقع خطأ غير متوقع ' );
    }
    // this.errorPoopService.showError('An unexpected error occurred. Please try again later.');
  }

}
