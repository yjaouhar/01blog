import { Component, inject, Input, NgModule } from '@angular/core';
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

@Component({
  selector: 'app-user-details-component',
  imports: [PosteComponent, ListUsersComponent, CommonModule, EditProfileModal, ConfirmComponent],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent {
  @Input() profileDetails!: ProfileModel;
  selectedFollowers = false;
  selectedFollowing = false;
  showPostes = true;
  posteServic = inject(HomeService)
  discoverService = inject(DiscoverService)
  postes = [];
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
  followRequest(id: string) {
    console.log("----> follow : ", id);

  }
  unfollow(conferm: boolean, id: string) {

    if (!conferm) {
      return
    }
    console.log("===> unfollow : ", id);

  }
  changeFollowersView(event: any) {
    this.selectedFollowers = event.target.value;
    console.log("******", this.selectedFollowers);

  }
  updateProfile(data: FormData) {
    const d = data.get('data');

    console.log("________ ", d);


  }
}
