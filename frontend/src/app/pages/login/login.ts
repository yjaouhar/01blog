import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasicAuthType } from '../../model/basicAuth.type';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  authService = inject(AuthService);
  router = inject(Router)
  // show = signal(false)
  hasError = signal(false);
  messagError = signal('')
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  ngOnInit(): void {
    if (this.authService.user$) {
      this.router.navigate(['/'])
      return
    }
    // this.show.set(true)
  }
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
        let message = 'Something went wrong, please try again.';
        const resMessage: any = (res as any).message;
        if (typeof resMessage === 'string') {
          message = resMessage;
        } else if (Array.isArray(resMessage)) {
          message = resMessage.map((m: any) => '*' + (m?.message ?? String(m))).join('\n');
        }
        this.messagError.set(message)
      }
    })
  }

}
