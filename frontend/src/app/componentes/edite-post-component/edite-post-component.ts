import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Media, Post } from '../../model/post.type';
import { environment } from '../../../environments/enveronment';
import { PostService } from '../../services/post.service';
declare var bootstrap: any;

@Component({
  selector: 'app-edite-post-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edite-post-component.html',
  styleUrl: './edite-post-component.css',
})
export class EditePostComponent {

  @Input() post!: Post;
  currentMediaFile = signal<File[]>([]);
  existingMedia = signal<Media[]>([]);
  removedMediaIds = signal<string[]>([]);
  url = environment.apiUrl;
  form: FormGroup;

  hasChange = false;
  hasError = signal(false);
  messagError = signal('');
  posteService = inject(PostService)
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      userInput: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(500)])
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
      this.existingMedia.set(this.post.media)
    }
  }
  async addMedia(event: Event) {
    this.hasError.set(false)
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const type = file.type.startsWith('image') ? 'image' : 'video';
    if (type !== "image" && type !== "video") {
      this.hasError.set(true)
      this.messagError.set(`Only image/video allowed`)
      return
    }
    // max size in bytes(5MB for image, 20MB for video)
    const maxSize = type == "image" ? 8 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      this.hasError.set(true);
      this.messagError.set(`File too large. Max allowed: ${maxSize / (1024 * 1024)} MB`)
      return
    }
    let url = '';
    if (type === 'image') {
      const croppedBlob = await this.posteService.cropImageToSquare(file, 150);
      url = URL.createObjectURL(croppedBlob);
    } else {
      url = URL.createObjectURL(file);
    }

    this.existingMedia.update(arr => [...arr, { mediaUrl: url, mediaType: type }]);
    this.currentMediaFile.update(arr => [...arr, file])
    this.hasChange = true;
    input.value = '';
  }


  deleteMedia(url: string) {
    this.existingMedia.update(p => p.filter(m => m.mediaUrl != url))
    this.removedMediaIds.update(arr => [...arr, url])
    this.hasChange = true

  }
  close() {
    this.currentMediaFile.set([]);
    this.removedMediaIds.set([]);
    this.existingMedia.set(this.post.media)
    this.form.patchValue({ userInput: this.post.descreption });
  }
  onDescChange() {
    this.hasError.set(false);
  }
  difindUrl(mediaUrl: string) {
    if (!mediaUrl.startsWith("blob")) {
      return this.url;
    }
    return ""
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const newDesc: string = this.form.value.userInput;
    if (!newDesc.trim() || (this.post.descreption === newDesc && !this.hasChange)) {
      this.messagError.set('You must select a file and change the description!');
      this.hasError.set(true);
      return
    }

    const formData = new FormData();
    const data = {
      description: newDesc,
      postId: this.post.id,
      removedMediaIds: this.removedMediaIds()
    }
    formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }))
    this.currentMediaFile().forEach(f => {
      formData.append('file', f)
    })


    this.posteService.editePost(formData).subscribe({
      next: res => {
        console.log("post edited : ", res);
        this.post.media = res.data as any;
        if (this.post.descreption !== newDesc) {
          this.post.descreption = newDesc
        }
      }
    });
    const modalEl = document.getElementById('editPostModal' + this.post.id);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}
