import { Injectable } from '@angular/core';
import { ProfileModel } from '../model/profileInfo.type';

type Result = {
  valid: boolean;
  message?: string;
};
@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  ValidProfileUpdate(
    username: string, name: string, gender: string, bio: string,
    email: string, age: string, hasChange: boolean, profDetails: ProfileModel
  ): Result {

    const noChanges =
      username === profDetails.username &&
      name === profDetails.name &&
      gender === profDetails.gander &&
      bio === profDetails.bio &&
      email === profDetails.email &&
      age === profDetails.age;

    if (noChanges && !hasChange) {
      return { valid: false, message: 'No changes detected' };
    }
    if (username.length < 3 || username.length > 15) {
      return { valid: false, message: 'Username must be between 3 and 15 characters' };
    }
    if (name.length < 3 || name.length > 20) {
      return { valid: false, message: 'Name must be between 3 and 20 characters' };
    }
    if (gender !== 'male' && gender !== 'female') {
      return { valid: false, message: 'Gender value is not valid' };
    }

    if (bio.length < 10 || bio.length > 100) {
      return { valid: false, message: 'Bio must be between 10 and 100 characters' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Email is not valid' };
    }

    const birth = new Date(age);
    const now = new Date();
    const diffYears = now.getFullYear() - birth.getFullYear();

    if (diffYears < 10) {
      return { valid: false, message: 'Age must be 10 or above' };
    }

    return { valid: true };
  }

}
