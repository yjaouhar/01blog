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


    if ( !hasChange) {
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

    if (bio.length < 10 || bio.length > 200) {
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
  validBirthday(input: string): boolean {
    const birthDate = new Date(input);
    const currentDate = new Date()
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      currentDate.getMonth() > birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }
    return age >= 10;
  }
  timeAgo(dateInput: Date | string): string {
    const date = new Date(dateInput);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const seconds = Math.floor(diffMs / 1000);

    if (seconds < 60) {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }

  isEmpty<T>(arr: T[] | null) {
    return arr && arr !== null && arr.length > 0;
  }
}
