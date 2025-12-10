import { Injectable } from '@angular/core';
import { BasicAuthType } from '../model/basicAuth.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  logine(basicAuth: BasicAuthType) {
    console.log(basicAuth);
  }
}
