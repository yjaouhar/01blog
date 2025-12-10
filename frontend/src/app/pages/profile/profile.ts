import { Component, inject, signal } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { ProfileModel } from '../../model/profileInfo.type';
import { UserDetailsComponent } from "../../componentes/user-details-component/user-details-component";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  imports: [UserDetailsComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  private route = inject(ActivatedRoute);
  prosfileService = inject(UserProfileService);
  profileDetails!: ProfileModel;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      this.loadData(username);
    });
  }

  loadData(username: string | null) {
    if (username) {
      this.profileDetails =
        this.prosfileService.getUserProfileWithUsername(username);
    } else {
      this.profileDetails =
        this.prosfileService.getUserProfile();
    }
  }
}
