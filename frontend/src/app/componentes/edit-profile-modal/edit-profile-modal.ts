import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileModel } from '../../model/profileInfo.type';
import { single } from 'rxjs';
import { UtilsService } from '../../services/utils.service';
declare var bootstrap: any;

@Component({
  selector: 'app-edit-profile-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile-modal.html',
  styleUrl: './edit-profile-modal.css',
})
export class EditProfileModal {
  @Input() profile!: ProfileModel;
  @Input() id!: string;
  @Output() onSave = new EventEmitter<any>();
  currentMediaFile: File | null = null;
  currentMedia = signal<string | null>(null);
  form!: FormGroup;
  hasChange = false;
  showErrore = signal(false);
  errorMessage = '';
  utilsService = inject(UtilsService)
  constructor(private fb: FormBuilder) { }
  ngAfterViewInit() {
    const modalEl = document.getElementById('editProfileModal' + this.profile.id);
    if (!modalEl) return;

    modalEl.addEventListener('hide.bs.modal', () => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
  ngOnInit() {
    this.form = this.fb.group({
      username: [this.profile.username],
      name: [this.profile.name],
      gender: [this.profile.gander],
      bio: [this.profile.bio],
      email: [this.profile.email],
      age: [this.profile.age]
    });
    this.currentMedia.set(this.profile.avatar);
  }
  change() {
    this.showErrore.update(() => false);
  }
  deletMedia() {
    this.currentMedia.update(() => null);
    this.hasChange = true;
    this.showErrore.update(() => true)
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.currentMediaFile = file;
    const type: string = file.type;
    if (!type.startsWith('image')) {
      this.errorMessage = 'format of image';
      this.showErrore.update(() => true);
      this.hasChange = false;
      return;
    }
    const reader = new FileReader();
    this.hasChange = true;
    reader.onload = () => {
      this.currentMedia.update(() => reader.result as string);
    };
    reader.readAsDataURL(file);
  }
  submit() {
    const data = this.form.value;
    const validation = this.utilsService.ValidProfileUpdate(data.username, data.name, data.gender, data.bio, data.email, data.age, this.hasChange, this.profile);
    if (!validation.valid) {
      this.errorMessage = validation.message!;
      this.showErrore.update(() => true);
      return
    }

    const formData = new FormData();
    formData.append('data', { ...this.form.value });
    formData.append('file', this.currentMediaFile!);

    this.onSave.emit(formData);

    const modalEl = document.getElementById('editProfileModal' + this.profile.id);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}
