import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../services/user-profile.service';
import { ProfileModel } from '../../model/profileInfo.type';
import { UserDetailsComponent } from "../../componentes/user-details-component/user-details-component";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  imports: [UserDetailsComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  private route = inject(ActivatedRoute);
  prosfileService = inject(ProfileService);
  username = signal('')
  profileDetails!: ProfileModel;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username.set(params.get('username') ?? '')
    });
    this.profileDetails = this.prosfileService.getUserProfile(this.username());

  }


}
