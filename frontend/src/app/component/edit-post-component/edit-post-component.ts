import { Component, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PosteComponent } from '../poste-component/poste-component';
import { PostModel } from '../../model/poste-model';

@Component({
  selector: 'app-edit-post',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post-component.html',
})
export class EditPostComponent {

  @Input() post!: PostModel;
  currentMedia: string | null = null;
  currentMediaFile: File | null = null;

  form: FormGroup;
  isImage = false;
  isVideo = false;
  showError = false;
  errorMsg = '';
  changed = false;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      userInput: ['']
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['desc'] && this.post !== undefined) {
      this.form.patchValue({ userInput: this.post.descreption });
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.showError = false;
    this.currentMediaFile = file;
    const type = file.type;

    const reader = new FileReader();
    reader.onload = () => {
      this.currentMedia = reader.result as string;
      this.isImage = type.startsWith("image");
      this.isVideo = type.startsWith("video");
    };
    reader.readAsDataURL(file);
  }

  deleteMedia() {
    this.currentMedia = null;
    this.currentMediaFile = null;
    this.isImage = false;
    this.isVideo = false;
  }
  onDescChange() {
    this.showError = false;
  }
  onSubmit() {
    const newDesc: string = this.form.value.userInput;
    if (!newDesc.trim() || this.post.descreption === newDesc || this.post.mediaUrl === this.currentMedia) {
      this.errorMsg = 'You must select a file and change the description!';
      this.showError = true;
      return
    }
    console.log("--> post Id : ", this.post.id);

    const formData = new FormData();
    formData.append('description', newDesc)
    formData.append('file', this.currentMediaFile!)

  }
}
