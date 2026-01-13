import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { throwError } from 'rxjs';

bootstrapApplication(App, appConfig)
  .catch((err) =>throwError(()=>err));
