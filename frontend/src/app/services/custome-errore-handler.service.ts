import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ErrorePopService } from './errore-pop.service';

@Injectable({
  providedIn: 'root',
})
export class CustomeErroreHandlerService implements ErrorHandler {

  errorPoopService = inject(ErrorePopService);

  handleError(error: any): void {
    let userMessage = 'Something went wrong, please try again.';
    let errorCatch = false;
    if (Array.isArray(error?.error?.errors)) {
      userMessage = error?.error?.errors.map((m: any) => '* ' + (m?.message ?? String(m))).join('\n');
      errorCatch = true
    } else if (typeof error?.error?.errors === "string") {
      errorCatch = true
      userMessage = error?.error
    }
    if (!errorCatch) {
      if (error?.status === 400) {
        userMessage = 'Bad request, please check your input.';
      } else if (error?.status === 401) {
        userMessage = 'Unauthorized, please log in.';
      } else if (error?.status === 403) {
        userMessage = 'You do not have permission to to access.';
      } else if (error?.status === 404) {
        userMessage = 'The requested resource was not found.';
      } else if (error?.status === 500) {
        userMessage = 'Server error, please try again later.';
      }
    }

    this.errorPoopService.showError(userMessage);
  }

}
