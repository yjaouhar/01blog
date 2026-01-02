import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ErrorePopService } from './errore-pop.service';

@Injectable({
  providedIn: 'root',
})
export class CustomeErroreHandlerService implements ErrorHandler {

  errorPoopService = inject(ErrorePopService);

  handleError(error: any): void {
    console.log('==> Custom Error Handler:', error);
    let userMessage = 'Something went wrong, please try again.';
    if (error?.error) {
      userMessage = error?.error
    }
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

    this.errorPoopService.showError(userMessage);
  }

}
