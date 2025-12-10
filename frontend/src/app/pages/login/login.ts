import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasicAuthType } from '../../model/basicAuth.type';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  })

  submit() {
    const loginForm = this.loginForm;
    if (loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const basicAuth: BasicAuthType = {
      username: loginForm.value.username!,
      password: loginForm.value.password!
    }
    this.authService.logine(basicAuth)
  }

}
