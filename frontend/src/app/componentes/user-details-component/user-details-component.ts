import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { DiscoverService } from '../../services/discover.service';
import { ProfileModel } from '../../model/profileInfo.type';
import { CommonModule } from '@angular/common';
import { EditProfileModal } from "../edit-profile-modal/edit-profile-modal";
import { AuthService } from '../../services/auth.service';
import { Confermation } from "../confermation/confermation";
import { environment } from '../../../environments/enveronment';
import { UtilsService } from '../../services/utils.service';
import { Report } from "../report/report";
import { ProfileService } from '../../services/user-profile.service';
import { PostModel } from '../../model/post.type';
import { PosteComponent } from "../poste.component/poste-component";

@Component({
  selector: 'app-user-details-component',
  imports: [EditProfileModal, Confermation, Report, PosteComponent],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent {

  @Input() profileDetails!: ProfileModel;
  selectedFollowers = false;
  selectedFollowing = false;
  showPostes = true;
  authService = inject(AuthService);
  posteServic = inject(HomeService);
  utils = inject(UtilsService);
  discoverService = inject(DiscoverService);
  profileService = inject(ProfileService);
  postes = signal<PostModel | null>(null);
  showConfermation = signal(false);
  showEditeComponent = signal(false)
  showReport = signal(false)
  url = environment.apiUrl;




  getPost() {
    this.profileService.getPostes(this.profileDetails.id).subscribe({
      next: res => {
        this.postes.set(res.data);
      }
    })
  }

  togglePosts() {
    this.getPost()
    this.showPostes = true;
    this.selectedFollowing = false;
    this.selectedFollowers = false
  }

  toggleFollowers() {
    this.showPostes = false;
    this.selectedFollowing = false;
    this.selectedFollowers = true
  }
  toggleFollowing() {
    this.showPostes = false;
    this.selectedFollowers = false
    this.selectedFollowing = true;

  }
  followRequest() {
    this.discoverService.subscribe(this.profileDetails.id).subscribe({
      next: () => {
        this.profileDetails.reacted = !this.profileDetails.reacted
        this.profileDetails.followers = true ? this.profileDetails.followers + 1 : this.profileDetails.followers - 1;
      }
    })

  }
  unfollow(conferm: boolean) {
    if (!conferm) {
      this.showConfermation.set(false)
      return
    }
    this.showConfermation.set(false)
    this.followRequest()
  }
  report(event: boolean) {
    if (event) {
      this.showReport.set(true)
      return
    }
    this.showReport.set(false)
  }
  hidEditComponent() {
    this.showEditeComponent.set(false)
  }
}
