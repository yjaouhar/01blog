import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  http = inject(HttpClient)
  hhh = computed(signal('s'));

  getPodteData() {
    const r = this.http.get('ddd')
    return [
      {

        id: '1',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Sunset in Marrakech',
        descreption: 'The colors of the sky tonight were magical 🌅.',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 120,
        totalComment: 14,
        liked: true
      },
      {
        id: '2',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Coding Night',
        descreption: 'Late night debugging session with coffee ☕ and lo-fi beats.',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 85,
        totalComment: 9,
        liked: false
      },
      {
        id: '3',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Sahara Adventure',
        descreption: 'Exploring the endless dunes of Merzouga 🏜️.',
        mediaType: 'video',
        mediaUrl: '/v.webm',
        totalLike: 200,
        totalComment: 25,
        liked: true
      },
      {
        id: ' 4',
        authore: 'yassine jaouhary',
        avatar: 'd.jpg',
        time: new Date,
        title: 'Couscous Friday',
        descreption: 'Family lunch with the traditional Moroccan couscous 🍲.',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 65,
        totalComment: 8,
        liked: false
      },
      {
        id: ' 5',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Casablanca Streets',
        descreption: 'The hustle and bustle of downtown Casa 🏙️.',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 90,
        totalComment: 12,
        liked: true
      },
      {
        id: ' 6',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Football Night',
        descreption: 'Morocco vs. Senegal — what a match! ⚽🇲🇦',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 300,
        totalComment: 40,
        liked: true
      },
      {
        id: ' 7',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Atlas Mountains',
        descreption: 'Hiking through the beauty of the High Atlas ⛰️.',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 110,
        totalComment: 7,
        liked: false
      },
      {
        id: ' 8',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Art in Rabat',
        descreption: 'Visited an amazing local art gallery 🎨.',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 45,
        totalComment: 6,
        liked: false
      },
      {
        id: ' 9',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Coding Bootcamp',
        descreption: 'Another productive day learning Angular 🚀.',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 180,
        totalComment: 22,
        liked: true
      },
      {
        id: '10',
        authore: 'yassine jaouhary',
        avatar: '/d.jpg',
        time: new Date,
        title: 'Beach Vibes',
        descreption: 'Relaxing day at Agadir beach 🌊.',
        mediaType: 'image',
        mediaUrl: '/p.jpg',
        totalLike: 150,
        totalComment: 19,
        liked: true
      }
    ]
  }
}
