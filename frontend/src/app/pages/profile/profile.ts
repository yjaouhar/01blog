import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../services/user-profile.service';
import { ProfileModel } from '../../model/profileInfo.type';
import { UserDetailsComponent } from "../../componentes/user-details-component/user-details-component";
import { ActivatedRoute } from '@angular/router';
import { single, throwError } from 'rxjs';
import { NotResorce } from "../../componentes/not-resorce/not-resorce";


@Component({
  selector: 'app-profile',
  imports: [UserDetailsComponent, NotResorce],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  private route = inject(ActivatedRoute);
  prosfileService = inject(ProfileService);
  username = signal('')
  resevData = signal(false);
  profileDetails!: ProfileModel;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username.set(params.get('username') ?? '')
    });
    this.prosfileService.getUserProfile(this.username()).subscribe({
      next: res => {
        this.profileDetails = res.data;
        
      },
      error: err => {
        this.resevData.set(true)
        throw err
      },
      complete: () => {
        this.resevData.set(true)
      }
    
    });

  }


}
