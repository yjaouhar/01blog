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

@Component({
  selector: 'app-user-details-component',
  imports: [PosteComponent, ListUsersComponent, CommonModule, EditProfileModal, ConfirmComponent, Confermation, NotResorce],
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
  discoverService = inject(DiscoverService)
  postes = [];
  showConfermation = signal(false);
  showEditeComponent= signal(true)
  // subscribed = this.discoverService.getUsers().filter(u => u.subscribed)
  // subscriber = this.discoverService.getUsers().filter(u => !u.subscribed)
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
    console.log("----> follow : ", this.profileDetails.id);
    this.profileDetails.isFollowing = !this.profileDetails.isFollowing
    this.profileDetails.totalFollow = true ? this.profileDetails.totalFollow + 1 : this.profileDetails.totalFollow - 1;
  }
  unfollow(conferm: boolean) {
    if (!conferm) {
      this.showConfermation.set(false)
      return
    }
    this.showConfermation.set(false)
    this.followRequest()
  }

  hidEditComponent() {
    this.showEditeComponent.set(false)
  }
}
