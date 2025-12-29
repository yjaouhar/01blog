import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasicAuthType } from '../../model/basicAuth.type';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  constructor(
    private router: Router
  ) { }
  hasError = signal(false);
  messagError = signal('')
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })

  submit() {
    const loginForm = this.loginForm;
    if (loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const basicAuth: BasicAuthType = {
      email: loginForm.value.username!,
      password: loginForm.value.password!
    }
    this.authService.logine(basicAuth).subscribe(res => {
      if (res.success) {

        this.router.navigate(['/'])
      } else {
        this.hasError.set(true)
        const message = res.message?.map(m => '*' + m.message).join('\n');
        this.messagError.set(message!)
      }
    })
  }

}
