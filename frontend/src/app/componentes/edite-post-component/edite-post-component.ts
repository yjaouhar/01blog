import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostModel } from '../../model/post.type';
declare var bootstrap: any;

@Component({
  selector: 'app-edite-post-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edite-post-component.html',
  styleUrl: './edite-post-component.css',
})
export class EditePostComponent {

  @Input() post!: PostModel;
  currentMedia: string | null = null;
  currentMediaFile: File | null = null;

  form: FormGroup;
  isImage = false;
  isVideo = false;
  hasChange = false;
  showError = false;
  errorMsg = '';
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      userInput: ['']
    });
  }
  ngAfterViewInit() {
    const modalEl = document.getElementById('editPostModal' + this.post.id);
    if (!modalEl) return;

    modalEl.addEventListener('hide.bs.modal', () => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['post'] && this.post !== undefined) {
      this.form.patchValue({ userInput: this.post.descreption });
      this.currentMedia = this.post.mediaUrl
      this.isImage = this.post.mediaType === 'image';
      this.isVideo = this.post.mediaType === 'video'
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.showError = false;
    this.currentMediaFile = file;
    const type = file.type;
    const reader = new FileReader();
    this.hasChange = true;
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
    if (!newDesc.trim() || (this.post.descreption === newDesc && !this.hasChange)) {
      this.errorMsg = 'You must select a file and change the description!';
      this.showError = true;
      return
    }

    console.log("edited");

    const formData = new FormData();
    formData.append('description', newDesc)
    formData.append('file', this.currentMediaFile!)
    const modalEl = document.getElementById('editPostModal' + this.post.id);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}
