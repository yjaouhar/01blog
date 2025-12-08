import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  getUserProfileWithUsername(username: string) {
    console.log("prof user ==> : ", username);
    let m = new Map()
    m.set("yjaouhar", {
      id: "1",
      avatar: '/prof.png',
      username: 'yjaouhar',
      name: 'yassine jaouhary',
      age: '21',
      gander: 'male',
      bio: 'hello word',
      email: 'yassine@gmail.com',
      totalPoste: 100,
      totalFollow: 1020,
      totalFollowing: 300,

    }
    )
    m.set("test1", {
      id: "2",
      username: 'test1',
      avatar: '/prof.png',
      name: 'yassine jaouhary',
      age: '21',
      gander: 'male',
      bio: 'hello word',
      email: 'yassine@gmail.com',
      totalPoste: 100,
      totalFollow: 1020,
      totalFollowing: 300,

    }
    )
    return m.get(username)
  }
  getUserProfile() {

    return {
      id: "!",
      avatar: '/prof.png',
      username: 'admin',
      name: 'yassine jaouhary',
      age: '21',
      gander: 'male',
      bio: 'hello word',
      email: 'yassine@gmail.com',
      totalPoste: 100,
      totalFollow: 1020,
      totalFollowing: 300,

    }
  }

}
