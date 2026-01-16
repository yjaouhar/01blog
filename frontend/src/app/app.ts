import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ErrorPopComponent } from "./componentes/error-pop-component/error-pop-component";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorPopComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  authSrvice = inject(AuthService)
  router = inject(Router)
  ngOnInit(): void {
    // this.authSrvice.user$.subscribe({
    //   next: r => {
    //     if (r) {
    //       this.router.navigate(['/'])
    //       // console.log("11 **_*__**_*",r);
    //     }

    //   }
    // })
    // this.authSrvice.getMe().subscribe({
    //   next: res => {
    //     // this.router.navigate(['/'])
    //     console.log("$$$---$$$$ ", res);
    //   }, error: err => {
    //     console.log("$$$$$$$$$ err : ", err);

    //   }
    // })
    // this.authSrvice.user$.subscribe({
    //   next: r => {
    //     if (r) {
    //       console.log("22 **_*__**_*", r);
    //     }

    //   }
    // })


  }
}
