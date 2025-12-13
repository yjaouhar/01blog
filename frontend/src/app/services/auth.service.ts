import { inject, Injectable } from '@angular/core';
import { BasicAuthType } from '../model/basicAuth.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  http = inject(HttpClient)
  register(formData: FormData) {
    this.http.post('http://localhost:8080/api/auth/register', formData).subscribe({
      next: (data) => {
        console.log("success : ", data);
      },
      error: (err) => {
        console.log("error : ", err);
      },
      complete: () => { console.log("complate") },
    })


  }
  logine(basicAuth: BasicAuthType) {
    console.log(basicAuth);
  }
}
