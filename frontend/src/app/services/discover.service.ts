import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DiscoverService {

  getUsers() {
    return [
      {
        id: '1',
        username: 'yjaouhar',
        name: 'Technology',
        avatar: "/d.jpg",
        totalPoste: 1250,
        subscribed: true
      },
      {
        id: '2',
        username: 'test1',
        name: 'Travel',
        avatar: "/d.jpg",
        totalPoste: 980,
        subscribed: false
      },
      {
        id: '3',
        username: 'test2',
        name: 'Food & Recipes',
        avatar: "/d.jpg",
        totalPoste: 2100,
        subscribed: true
      },
      {
        id: '4',
        username: 'yjaouhar',
        name: 'Photography',
        avatar: "/d.jpg",
        totalPoste: 1570,
        subscribed: false
      },
      {
        id: '5',
        username: 'yjaouhar',
        name: 'Fitness & Health',
        avatar: "/d.jpg",
        totalPoste: 1890,
        subscribed: true
      },
      {
        id: '6',
        username: 'yjaouhar',
        name: 'Art & Design',
        avatar: "/d.jpg",
        totalPoste: 1340,
        subscribed: false
      },
      {
        id: '7',
        username: 'yjaouhar',
        name: 'Science',
        avatar: "/d.jpg",
        totalPoste: 1120,
        subscribed: true
      },
      {
        id: '8',
        username: 'yjaouhar',
        name: 'Movies & Series',
        avatar: "/d.jpg",
        totalPoste: 2250,
        subscribed: true
      },
      {
        id: '9',
        username: 'yjaouhar',
        name: 'Gaming',
        avatar: "/d.jpg",
        totalPoste: 3100,
        subscribed: false
      },
      {
        id: '10',
        username: 'yjaouhar',
        name: 'Education',
        avatar: "/d.jpg",
        totalPoste: 1750,
        subscribed: true
      },


    ]
  };

}
