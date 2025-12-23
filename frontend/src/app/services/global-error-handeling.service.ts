import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandelingService implements ErrorHandler {
  handleError(error: any): void {
    console.log("Error in global error : ", error);

  }

}
