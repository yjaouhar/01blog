import { Component, signal } from '@angular/core';
import { DiscoverModel } from '../../model/discover-model';
import { SubscriberDirectives } from "../../directives/subscriber-directives";
import { ProfileComponent } from "../../component/profile-component/profile-component";
import { CommentComponent } from "../../component/comment-component/comment-component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discover',
  imports: [SubscriberDirectives, ProfileComponent, CommentComponent, CommonModule],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover {

  profiles = signal<DiscoverModel[]>([
    {
      id: 1,
      name: 'Technology',
      avatar: "/d.jpg",
      totalPoste: 1250,
      totalSubscriber: 43000,
      subscribed: true
    },
    {
      id: 2,
      name: 'Travel',
      avatar: "/d.jpg",
      totalPoste: 980,
      totalSubscriber: 37200,
      subscribed: false
    },
    {
      id: 3,
      name: 'Food & Recipes',
      avatar: "/d.jpg",
      totalPoste: 2100,
      totalSubscriber: 52800,
      subscribed: true
    },
    {
      id: 4,
      name: 'Photography',
      avatar: "/d.jpg",
      totalPoste: 1570,
      totalSubscriber: 44100,
      subscribed: false
    },
    {
      id: 5,
      name: 'Fitness & Health',
      avatar: "/d.jpg",
      totalPoste: 1890,
      totalSubscriber: 50300,
      subscribed: true
    },
    {
      id: 6,
      name: 'Art & Design',
      avatar: "/d.jpg",
      totalPoste: 1340,
      totalSubscriber: 29400,
      subscribed: false
    },
    {
      id: 7,
      name: 'Science',
      avatar: "/d.jpg",
      totalPoste: 1120,
      totalSubscriber: 31800,
      subscribed: true
    },
    {
      id: 8,
      name: 'Movies & Series',
      avatar: "/d.jpg",
      totalPoste: 2250,
      totalSubscriber: 67800,
      subscribed: true
    },
    {
      id: 9,
      name: 'Gaming',
      avatar: "/d.jpg",
      totalPoste: 3100,
      totalSubscriber: 89000,
      subscribed: false
    },
    {
      id: 10,
      name: 'Education',
      avatar: "/d.jpg",
      totalPoste: 1750,
      totalSubscriber: 45500,
      subscribed: true
    }])
  toggleSubscribe() {

    const confirmed = window.confirm('Are you sure you want to unsubscribe?');
    if (!confirmed) return
    // user.subscribed = !user.subscribed;
    // this.profiles.update(u => {
    //   return u.map(u => {
    //     if (u.id === user.id) {
    //       return {
    //         ...u, subscribed: false
    //       }
    //     }
    //     return u
    //   })
    // });
  }
  selectedUser = signal<DiscoverModel | null>(null);

  openUserPopup(user: DiscoverModel) {
    this.selectedUser.set(user);
  }

  closeUserPopup() {
    this.selectedUser.set(null);
  }

  goToProfile(user: DiscoverModel | null) {
    // hna tdir navigation l profile page
    // example: this.router.navigate(['/profile', user.id]);
    if (user !== null) {

      console.log('Go to profile', user.name);
    }
  }

}
