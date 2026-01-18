import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
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
import { Post } from '../../model/post.type';
import { PosteComponent } from "../poste.component/poste-component";
import { ListUsersComponent } from "../list-users-component/list-users-component";
import { User } from '../../model/discover.type';

@Component({
  selector: 'app-user-details-component',
  imports: [EditProfileModal, Confermation, Report, PosteComponent, ListUsersComponent],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent implements OnChanges {


  @Input() profileDetails!: ProfileModel;
  selectedFollowers = false;
  selectedFollowing = false;
  showPostes = true;
  authService = inject(AuthService);
  posteServic = inject(HomeService);
  utils = inject(UtilsService);
  discoverService = inject(DiscoverService);
  profileService = inject(ProfileService);
  postes = signal<Post[]>([]);
  followers = signal<User[]>([]);
  following = signal<User[]>([]);
  showConfermation = signal(false);
  showEditeComponent = signal(false)
  loadFollowers = signal(false);
  loadFollowing = signal(false);
  loadPost = signal(false);
  showReport = signal(false)
  url = environment.apiUrl;


  ngOnChanges(changes: SimpleChanges): void {
    if (this.profileDetails) {
      this.getPost()
    }
  }

  getPost() {
    this.profileService.getPostes(this.profileDetails.id).subscribe({
      next: res => {
        this.postes.set(res.data);
      }
    })
  }
  getFollowing() {
    this.profileService.getFollowing(this.profileDetails.id).subscribe({
      next: res => {
        this.following.set(res.data);
        this.loadFollowing.set(true)
      }
    })
  }
  getFollowers() {
    this.profileService.getFollowers(this.profileDetails.id).subscribe({
      next: res => {
        this.followers.set(res.data);
        this.loadFollowers.set(true)
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
    this.getFollowers()
    this.showPostes = false;
    this.selectedFollowing = false;
    this.selectedFollowers = true
  }
  toggleFollowing() {
    this.getFollowing()
    this.showPostes = false;
    this.selectedFollowers = false
    this.selectedFollowing = true;

  }
  followRequest() {
    this.discoverService.subscribe(this.profileDetails.id).subscribe({
      next: () => {
        this.profileDetails.reacted = !this.profileDetails.reacted
        this.profileDetails.followers = this.profileDetails.reacted ? this.profileDetails.followers + 1 : this.profileDetails.followers - 1;
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
