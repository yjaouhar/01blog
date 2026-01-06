import { Component, inject, Input, NgModule, signal } from '@angular/core';
import { PostService } from '../../services/post.service';
import { HomeService } from '../../services/home.service';
import { PosteComponent } from "../poste.component/poste-component";
import { ProfileService } from '../../services/user-profile.service';
import { DiscoverService } from '../../services/discover.service';
import { ListUsersComponent } from "../list-users-component/list-users-component";
import { ProfileModel } from '../../model/profileInfo.type';
import { CommonModule } from '@angular/common';
import { EditProfileModal } from "../edit-profile-modal/edit-profile-modal";
import { ConfirmComponent } from "../confirm-component/confirm-component";
import { AuthService } from '../../services/auth.service';
import { Confermation } from "../confermation/confermation";
import { NotResorce } from "../not-resorce/not-resorce";
import { environment } from '../../../environments/enveronment';
import { NotFound } from "../../pages/not-found/not-found";
import { UtilsService } from '../../services/utils.service';
import { Report } from "../report/report";

@Component({
  selector: 'app-user-details-component',
  imports: [PosteComponent, ListUsersComponent, CommonModule, EditProfileModal, Confermation, NotResorce, Report],
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
  discoverService = inject(DiscoverService)
  postes = [];
  showConfermation = signal(false);
  showEditeComponent = signal(false)
  showReport = signal(false)
  url = environment.apiUrl;

  togglePosts() {
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
  report() {
this.showReport.set(true)
  }
  hidEditComponent() {
    this.showEditeComponent.set(false)
  }
}
