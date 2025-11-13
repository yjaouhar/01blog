import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import bootstrap from '../../../main.server';

interface Profile {
  id: number;
  name: string;
  avatar: string;
  role: string;
  posts: number;
  subscribers: number;
  following: number;
  age: number;
  gender: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.css'],
  imports: [CommonModule]
})
export class ProfileComponent {
  activeTab: string = 'followers'; // default tab

  profile() {
    return {
      avatar: 'https://i.pravatar.cc/80',
      name: 'Yassine Jaouhary',
      role: 'Developer',
      posts: 12,
      subscribers: 50,
      following: 30,
      age: 25,
      gender: 'Male',
      email: 'yassine@example.com',
      postList: [
        { title: 'Post 1' },
        { title: 'Post 2' },
        { title: 'Post 3' }
      ],
      followers: [
        { name: 'User 1' },
        { name: 'User 2' }
      ],
      followingList: [
        { name: 'User 3' },
        { name: 'User 4' }
      ]
    }
  }  selectedUser: any = null;
  openFollowModal(user: any) {
    this.selectedUser = user;
   
  }

  followUser(user: any) {
    user.isFollowed = true;
  }

  unfollowUser(user: any) {
    user.isFollowed = false;
  }

}
