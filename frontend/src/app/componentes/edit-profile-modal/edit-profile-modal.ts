import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileModel } from '../../model/profileInfo.type';
import { UtilsService } from '../../services/utils.service';
import { Edit } from '../../model/editProfile';
import { PostService } from '../../services/post.service';
import { ProfileService } from '../../services/user-profile.service';
import { environment } from '../../../environments/enveronment';

@Component({
  selector: 'app-edit-profile-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile-modal.html',
  styleUrl: './edit-profile-modal.css',
})
export class EditProfileModal {
  @Input() profile!: ProfileModel;
  @Output() hide = new EventEmitter();
  utils = inject(UtilsService);
  postService = inject(PostService);
  profileSrvice = inject(ProfileService)
  currentMediaFile: File | null = null;
  currentMedia = signal<string | null>(null);
  removeAvatar = signal(false);
  form!: FormGroup;
  hasChange = false;
  birthdayError = signal(false);
  showErrore = signal(false);
  errorMessage = '';
  url = environment.apiUrl;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form =
      new FormGroup({
        firstName: new FormControl(this.profile?.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
        lastName: new FormControl(this.profile?.lasteName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
        gender: new FormControl(this.profile?.gender, [Validators.required, Validators.pattern('male|female')]),
        birthday: new FormControl(this.profile?.birthday, Validators.required),
        bio: new FormControl(this.profile?.bio, Validators.maxLength(200)),
        username: new FormControl(this.profile?.userName, [Validators.minLength(4), Validators.maxLength(15)]),
        email: new FormControl(this.profile?.email, [Validators.required, Validators.email]),
      })

    this.currentMedia.set(this.profile?.avatar);

  }
  changeBirthaday(event: Event) {
    const birthday = event.target as HTMLInputElement
    UtilsService
    if (!this.utils.validBirthday(birthday.value)) {
      this.birthdayError.update(() => true);
    } else {
      this.birthdayError.update(() => false);
    }
  }


  close() {
    this.hide.emit()
  }
  deletMedia() {
    this.hasChange = true;
    this.showErrore.update(() => false)
    this.currentMedia.update(() => null);
    this.removeAvatar.set(true);
  }
  difindUrl(mediaUrl: string) {
    if (mediaUrl === this.profile.avatar) {
      return this.url;
    }
    return ""
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.showErrore.set(true);
      this.errorMessage = "Avatar too big!";
      return
    }
    const type: string = file.type;
    if (!type.startsWith('image')) {
      this.errorMessage = 'format of image';
      this.showErrore.update(() => true);
      this.hasChange = false;
      return;
    }
    this.currentMediaFile = file;
    const reader = new FileReader();
    this.hasChange = true;
    reader.onload = () => {
      this.currentMedia.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
  submit() {
    const form = this.form;

    if (form.invalid || this.birthdayError()) {
      this.form.markAllAsTouched();
      return
    }
    const data = form.value;
    const newData = new Edit(this.profile.id);

    if (data.firstName.trim() !== '' && data.firstName.trim() !== this.profile.firstName) {
      newData.firstName = data.firstName.trim();
    }

    if (data.lastName.trim() !== '' && data.lastName.trim() !== this.profile.lasteName) {
      newData.lastName = data.lastName.trim();
    }

    if (data.gender.trim() !== '' && data.gender.trim() !== this.profile.gender) {
      newData.gender = data.gender.trim();
    }

    if (data.birthday.trim() !== '' && data.birthday !== this.profile.birthday) {
      newData.birthday = data.birthday;
    }

    if (data.bio.trim() !== '' && data.bio.trim() !== this.profile.bio) {
      newData.bio = data.bio.trim();
    }

    if (data.username.trim() !== '' && data.username.trim() !== this.profile.userName) {
      newData.username = data.username.trim();
    }

    if (data.email.trim() !== '' && data.email.trim() !== this.profile.email) {
      newData.email = data.email.trim();
    }
    const change = Object.values(newData).every((v, i) => {
      if (i === 0) {
        return true
      }
      return v === null
    })
    if (change && !this.hasChange) {
      this.showErrore.set(true)
      this.errorMessage = "No changes detected"
      return;
    }
    newData.removeMedia = this.removeAvatar();
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(newData)], { type: 'application/json' }));
    formData.append('file', this.currentMediaFile!);
    this.profileSrvice.updateProfile(formData).subscribe({
      next: res => {
        console.log("====> profiele updated ✅ !! ", res);

      }
    })
    this.close()

  }
}
